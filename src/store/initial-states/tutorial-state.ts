import {CaretPosition, EditorFrameObjects, Definitions, RootContainerFrameDefinition, ImportsContainerDefinition, FuncDefContainerDefinition, MainFramesContainerDefinition} from "@/types/types";

const tutorialState: EditorFrameObjects = {
    0: {
        id: 0,
        frameType : RootContainerFrameDefinition,
        isDisabled: false,
        isSelected: false,
        isVisible: true,
        parentId: 0,
        childrenIds: [-1, -2, -3],
        jointParentId: 0,
        jointFrameIds: [],
        contentDict: { },
        caretVisibility: CaretPosition.none,
        multiDragPosition: "",
    },
    "-1": {
        id: -1,
        frameType : ImportsContainerDefinition,
        isDisabled: false,
        isSelected: false,
        isVisible: true,
        parentId: 0,
        childrenIds: [],
        jointParentId: 0,
        jointFrameIds: [],
        contentDict: {},
        caretVisibility: CaretPosition.none,
        multiDragPosition: "",
    },
    "-2": {
        id: -2,
        frameType : FuncDefContainerDefinition,
        isDisabled: false,
        isSelected: false,
        isVisible: true,
        parentId: 0,
        childrenIds: [],
        jointParentId: 0,
        jointFrameIds: [],
        contentDict: { },
        caretVisibility: CaretPosition.none,
        multiDragPosition: "",
    },
    "-3": {
        id: -3,
        frameType : MainFramesContainerDefinition,
        isDisabled: false,
        isSelected: false,
        isVisible: true,
        parentId: 0,
        childrenIds: [1,2,3],
        jointParentId: 0,
        jointFrameIds: [],
        contentDict: {},
        caretVisibility: CaretPosition.body,
        multiDragPosition: "",
    },
    1: {
        frameType: Definitions.CommentDefinition,
        id: 1,
        isDisabled: false,
        isSelected: false,
        isVisible: true,
        parentId: -3,
        childrenIds: [],
        jointParentId: 0,
        jointFrameIds: [],
        contentDict: { 0: {code :  "Tutorial example:", focused: false, error :"", shownLabel: true} },
        caretVisibility: CaretPosition.none,
        multiDragPosition: "",
    },
    2: {
        frameType: Definitions.VarAssignDefinition,
        id: 2,
        isDisabled: false,
        isSelected: false,
        isVisible: true,
        parentId: -3,
        childrenIds: [],
        jointParentId: 0,
        jointFrameIds: [],
        contentDict: {
            0: {code :  "nameList", focused: false, error :"", shownLabel: true},
            1: {code :  "[\"Joe\", \"Sam\", \"Ash\"]", focused: false, error :"", shownLabel: true} },
        caretVisibility: CaretPosition.none,
        multiDragPosition: "",
    },
    3: {
        frameType: Definitions.ForDefinition,
        id: 3,
        isDisabled: false,
        isSelected: false,
        isVisible: true,
        parentId: -3,
        childrenIds: [4],
        jointParentId: 0,
        jointFrameIds: [],
        contentDict: { 
            0: {code :  "name", focused: false, error :"", shownLabel: true},
            1: {code :  "nameList", focused: false, error :"", shownLabel: true} },
        caretVisibility: CaretPosition.none,
        multiDragPosition: "",
    },
    4: {
        frameType: Definitions.EmptyDefinition,
        id: 4,
        isDisabled: false,
        isSelected: false,
        isVisible: true,
        parentId: 3,
        childrenIds: [],
        jointParentId: 0,
        jointFrameIds: [],
        contentDict: { 0: {code :  "print(\"Hello \" + name)", focused: false, error :"", shownLabel: true} },
        caretVisibility: CaretPosition.none,
        multiDragPosition: "",
    },
};

export default tutorialState;