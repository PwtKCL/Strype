import { AddFrameCommandDef, Definitions } from "@/types/types";

//Commands for Frame insertion
const addFrameCommandsDefs: {[id: string]: AddFrameCommandDef} = {
    "i": {
        type: Definitions.IfDefinition,
        description: "if",
        shortcut: "i",
    },
    "l": {
        type: Definitions.ElifDefinition,
        description: "elif",
        shortcut: "l",
    },
    "e": {
        type: Definitions.ElseDefinition,
        description: "else",
        shortcut: "e",
    },
    "f": {
        type: Definitions.ForDefinition,
        description: "for",
        shortcut: "f",
    },
    "w": {
        type: Definitions.WhileDefinition,
        description: "while",
        shortcut: "w",
    },
    "b" : {
        type: Definitions.BreakDefinition,
        description: "break",
        shortcut: "b",
    },
    "u" : {
        type: Definitions.ContinueDefinition,
        description: "continue",
        shortcut: "u",
    },
    "=": {
        type: Definitions.VarAssignDefinition,
        description: "variable assignment",
        shortcut: "=",
    },
    " ": {
        type: Definitions.EmptyDefinition,
        description: "empty statement",
        shortcut: " ",
        symbol: "⌴",//"␣"
    },
    "r": {
        type: Definitions.ReturnDefinition,
        description: "return",
        shortcut: "r",
    },
    "d": {
        type: Definitions.FuncDefDefinition,
        description: "function definition",
        shortcut: "d",
    },
    "c": {
        type: Definitions.CommentDefinition,
        description: "comment",
        shortcut: "c",
    },
    "t": {
        type: Definitions.TryDefinition,
        description: "try",
        shortcut: "t",
    },
    "a" : {
        type: Definitions.RaiseDefinition,
        description: "raise",
        shortcut: "a",
    },
    "x": {
        type: Definitions.ExceptDefinition,
        description: "except",
        shortcut: "x",
    },
    "n": {
        type: Definitions.FinallyDefinition,
        description: "finally",
        shortcut: "n",
    },
    "m": {
        type: Definitions.ImportDefinition,
        description: "import",
        shortcut: "m",
    },
    "h": {
        type: Definitions.WithDefinition,
        description: "with",
        shortcut: "h",
    },
};


export default {
    AddFrameCommandsDefs: addFrameCommandsDefs,
}