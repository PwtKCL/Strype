// refs: http://skulpt.org/using.html#html and for the input/event part https://stackoverflow.com/questions/43733896/wait-for-an-event-to-occur-within-a-function-in-javascript-for-skulpt

import { LineAndSlotPositions } from "@/types/types";
import { useStore } from "@/store/store";
import i18n from "@/i18n";
import Vue from "vue";
import { CustomEventTypes, setPythonExecAreaExpandButtonPos } from "./editor";

const STRYPE_RUN_ACTION_MSG = "StrypeRunActionCalled";
const STRYPE_INPUT_INTERRUPT_ERR_MSG = "ExternalError: " + STRYPE_RUN_ACTION_MSG;

// Declation of JS objects required for using Skulpt:
// the output HTML object, a text area in our case. Declared globally in the script for ease of usage
// a Sk object that is FROM THE SKULPT LIBRARY, it is the main entry point of Skulpt
let consoleTextArea: HTMLTextAreaElement = {} as HTMLTextAreaElement; 
declare const Sk: any;
let codeExecStateRunningCheckFn: () => boolean | undefined;

// The function used for "output" from Skulpt, to be registered against the Skulpt object
function outf(text: string) { 
    consoleTextArea.value = consoleTextArea.value + text; 
    // Scroll to bottom:
    Vue.nextTick(() => {
        consoleTextArea.scrollTop = consoleTextArea.scrollHeight;
    });
}

// The function used for "input" from Skulpt, to be registered against the Skulpt object
// (this is the default behaviour that can be overwritten if needed)
function builtinRead(x: any) {
    if (Sk.builtinFiles === undefined || Sk.builtinFiles["files"][x] === undefined) {
        throw "File not found: '" + x + "'";
    }
    return Sk.builtinFiles["files"][x];
}

// The function used for "transpiling" the input function of Python to some JS handled by Skulpt.
// The function is to be registered against the Skulpt object.
function sInput(prompt: string) {
    // When we encounter an input call, we make sure the console has focus (i.e. turtle is not shown, for example)
    return new Promise(function(resolve,reject){
        outf(prompt); 
        // make the text area enabled to allow the user to type something (if it was disabled)
        const isConsoleTextAreaLocked = consoleTextArea.disabled;
        if(isConsoleTextAreaLocked){
            consoleTextArea.disabled = false;
            // Send an event to request focus (we will handle it on the Vue side)
            consoleTextArea.dispatchEvent(new Event(CustomEventTypes.pythonConsoleRequestFocus));            
        }

        let initialConsoleTextAreaCaretPos = consoleTextArea.selectionStart;
        let compositionStartSelectStart = -1, compositionStartSelectEnd = -1; // this is used for dealing with composition, cf. below

        function consoleCompositionListener(event: CompositionEvent){
            // Listened to handle the problem with IMEs: when used, they trigger text writing even if the key events prevent default behaviour.
            // So the approach to deal with it is to keep them anywhere, but if they appear in some parts of the console that shouldn't be edited
            // then we just update the flag of the input point of entry (initialConsoleTextAreaCaretPos)
            if(event.type.toLocaleLowerCase() === "compositionstart"){
                // Keep indicators of the selection when the composition occurs, in case there is a full portion of text replaced
                compositionStartSelectStart = consoleTextArea.selectionStart;
                compositionStartSelectEnd = consoleTextArea.selectionEnd;
            }
            else {
                // Compute the new position of the input point of entry when the composition is done, if it was performed within the non editable part
                // of the textarea (it might then overshoot the initial position if users selected, but at this stage we can't do much...)
                if(compositionStartSelectEnd < initialConsoleTextAreaCaretPos){
                    const addedTextFromIME = event.data;
                    initialConsoleTextAreaCaretPos = initialConsoleTextAreaCaretPos - ( compositionStartSelectEnd - compositionStartSelectStart) + addedTextFromIME.length;
                }               
            }
        }

        function consoleKeyListener(event: KeyboardEvent){
            const eventKeyLowerCase = event.key.toLowerCase();
            // monitor a key hit on "enter" to validate input
            if (eventKeyLowerCase == "enter") {
                // remove keyup handler from #console
                consoleTextArea.removeEventListener("keydown", consoleKeyListener);
                consoleTextArea.removeEventListener("compositionstart", consoleCompositionListener);
                consoleTextArea.removeEventListener("compositionend", consoleCompositionListener);
                // resolve the promise with the value of the input field
                const inputText = consoleTextArea.value.substring(initialConsoleTextAreaCaretPos);
                // add a line return to the console after we have retrieved the input text from user
                outf("\n");
                // restore the textare disable status if required
                if(isConsoleTextAreaLocked){
                    consoleTextArea.disabled = true;
                    // We may need to do more action after input is done
                    consoleTextArea.dispatchEvent(new Event(CustomEventTypes.pythonConsoleAfterInput));
                }
                // cancel the event (we are doing a line return ourselves anyway)
                event.stopImmediatePropagation();
                event.preventDefault();
                // now we can return the promise with the input text
                resolve(inputText);   
                // Clear the timer used to check interruptions
                clearTimeout(checkInterruptionHandle);             
                return;
            }
            
            // monitor where the keyboard input is on the output textarea: we cannot edit anything that is not after the prompt
            // so before the prompt we only allow the direction arrow keys and some key combinations
            if(consoleTextArea.selectionStart < initialConsoleTextAreaCaretPos
                && !(eventKeyLowerCase.startsWith("arrow") 
                    || ((event.ctrlKey || event.metaKey) && (["c","z","y"].includes(eventKeyLowerCase))))) {
                // we can't have a caret move further back, we break the event loop
                event.stopImmediatePropagation();
                event.preventDefault();
            }
            else if (eventKeyLowerCase=="backspace" && consoleTextArea.selectionStart == initialConsoleTextAreaCaretPos){
                // forbid delete text with backspace from the input start position
                event.stopImmediatePropagation();
                event.preventDefault();
            }
        }

        consoleTextArea.addEventListener("keydown", consoleKeyListener);
        consoleTextArea.addEventListener("compositionstart", consoleCompositionListener);
        consoleTextArea.addEventListener("compositionend", consoleCompositionListener);

        // When we are waiting for user input, it is possible the user has request the execution of their code to be stopped,
        // therefore, we shouldn't hang on this method and exit as soon as possible. To do so, we need to regularly check if
        // stopping the code execution has been requested: if so, we reject the input and make sure we leave in a clean UI state.
        const checkInterruptionHandle = setInterval(() => {
            if (codeExecStateRunningCheckFn && !codeExecStateRunningCheckFn()) {
                clearTimeout(checkInterruptionHandle);
                if(isConsoleTextAreaLocked){
                    consoleTextArea.disabled = true;
                }
                // remove keyup handler from #console
                consoleTextArea.removeEventListener("keydown", consoleKeyListener);
                consoleTextArea.removeEventListener("compositionstart", consoleCompositionListener);
                consoleTextArea.removeEventListener("compositionend", consoleCompositionListener);
                reject(STRYPE_RUN_ACTION_MSG);
                return;
            }
        }, 1000);

        // We check if the expand/collapse button needs to be repositioned.
        setPythonExecAreaExpandButtonPos();
    });
}

// Entry point function for running Python code with Skulpt - the UI is responsible for calling it,
// and providing the code (usually, user defined code) and the text area to display the output
export function execPythonCode(aConsoleTextArea: HTMLTextAreaElement, aTurtleDiv: HTMLDivElement|null, userCode: string, lineFrameMapping: LineAndSlotPositions, keepRunning: () => boolean,
                               executionFinished: (isListeningKeyEvents: boolean, isListeningMouseEvents: boolean, isListeningTimerEvents: boolean, stopTurtleListeners: VoidFunction | undefined) => any): void{
    consoleTextArea = aConsoleTextArea;
    codeExecStateRunningCheckFn = keepRunning;
    Sk.pre = consoleTextArea.id;
    // Set the Turtle environment here:
    Sk.TurtleGraphics = {};
    if(aTurtleDiv){
        Sk.TurtleGraphics.target = aTurtleDiv.id;
        // Our default canvas has a size of 400x300 (as default Python's)
        Sk.TurtleGraphics.width = 400;
        Sk.TurtleGraphics.height = 300;
        // Provide custom names for the custom events exposed by Skulpt for listening when mouse [resp. timer] events are off.
        // That's only ease of using our existing custom events naming mechanism, and because we "clear" the TurtleGraphics object
        // everytime an execution is finished (see below)
        Sk.TurtleGraphics.MouseEventsListenerOffEventName = CustomEventTypes.skulptMouseEventListenerOff;
        Sk.TurtleGraphics.TimerEventsListenerOffEventName = CustomEventTypes.skulptTimerEventListenerOff;
    }

    // Wrapper function for handling when Skulpt execution is finished
    function handleExecutionFinished(): void {
        // Before clearning TurtleGraphics (see below) we need to keep a reference on a few event listener related things.
        // Note that some user code may provoke the execution loop of Skulpt to finish while still having the UI listening
        // for events, that's why we need to keep track of whenever some events are still being listened by the UI to consider
        // whether the code execution is finished or not (for the UI/user point of view...)
        const isTurtleListeningKB = Sk.TurtleGraphics.isListeningKeyEvents;
        const isTurtleListeningMouse = Sk.TurtleGraphics.isListeningMouseEvents;
        const isTurtleListeningTimer = Sk.TurtleGraphics.isListeningTimerEvents;
        // Only set the "stop listener" function property hook if Turtle is still listening some events
        const stopTurtleListeners = (isTurtleListeningKB || isTurtleListeningMouse || isTurtleListeningTimer) ? Sk.TurtleGraphics.reset : undefined;
        // To make sure we don't get weird things happening on the Turtle, we don't keep Skulpt having a relation with the UI for Turtle
        // so that the UI will stay "idle" until the next run.
        Sk.TurtleGraphics = {};

        // Other actions requested by the caller of the execPythonCode function
        executionFinished(isTurtleListeningKB, isTurtleListeningMouse, isTurtleListeningTimer, stopTurtleListeners);
    }
    
    Sk.configure({output:outf, read:builtinRead, inputfun:sInput, inputfunTakesPrompt: true, yieldLimit:100,  killableWhile: true, killableFor: true});
    
    const myPromise = Sk.misceval.asyncToPromise(function() {
        return Sk.importMainWithBody("<stdin>", false, userCode, true);
    }, {
        // handle a suspension of the executing code
        // "*" says handle all types of suspensions
        "*": () => {
            if (!keepRunning()) {
                throw STRYPE_RUN_ACTION_MSG;
            }
        }});
    // Show error in Python console if error happens
    myPromise.then(() => {
        handleExecutionFinished();
        return;
    },
    (err: any) => {
        // We can use the mechanism in place in the Parser for the TigerPython errors mapping to find 
        // what line of code maps with what frame in case of an execution error.
        // We need to extract the line from the error message sent by Skulpt.
        const skulptErrStr: string = err.toString();
        let frameId = -1;
        const errLineMatchArray = skulptErrStr.match(/( on line )(\d+)/);
        if(errLineMatchArray !== null){
            const errorLine = parseInt(errLineMatchArray[2]);
            // Skuplt starts indexing at 1, we use 0 for TigerPython, so we need to offset the line number
            const locatableError = lineFrameMapping[errorLine - 1] !== undefined;
            
            // We assume that if we cannot find a frame assiocated with an error, it must be a Python line that shows as extra 
            // when the user code generates non well formated code --> e.g. adding an empty method call frame within an if frame
            // that doesn't contain any other children and is at the bottom of the code. The code generated in Python will be as an EOF error.
            // We then show the error on the last frame available in the list (that is, before the EOF, 2 lines ahead)
            frameId = (locatableError) ? lineFrameMapping[errorLine - 1].frameId : lineFrameMapping[errorLine - 3].frameId;

            const noLineSkulptErrStr = (locatableError) ? skulptErrStr.replaceAll(/ on line \d+/g,"") : i18n.t("errorMessage.EOFError") as string;
            // In order to show the Skulpt error in the editor, we set an error on all the frames. That approach is the best compromise between
            // our current error related code implementation and clarity for the user.
            // Exception: if we have a "running action" message, we don't show anything (no message and no error).
            if(!skulptErrStr.startsWith(STRYPE_INPUT_INTERRUPT_ERR_MSG)){
                consoleTextArea.value += ("< " + noLineSkulptErrStr + " >");
                // Set the error on the frame header -- do not use editable slots here as we can't give a detailed error location
                Vue.set(useStore().frameObjects[frameId],"runTimeError", noLineSkulptErrStr);   
                useStore().wasLastRuntimeErrorFrameId = frameId;      
            }   
        }
        else{
            // In case we couldn't get the line and the frame correctly, we just display a simple message,
            // EXCEPT if we have a "running action" message, which doesn't need to be displayed as the UI already gives cues.
            if(skulptErrStr.localeCompare(STRYPE_RUN_ACTION_MSG) != 0){
                consoleTextArea.value += ("< " + skulptErrStr + " >");
            }
        }
        handleExecutionFinished();
        // We will have added text either way, now scroll to bottom:
        Vue.nextTick(() => {
            consoleTextArea.scrollTop = consoleTextArea.scrollHeight;
        });
    });
}