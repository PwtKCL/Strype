import {ObjectPropertyDiff} from "@/types/types";

//Function to get the difference between two states (properties) of an object.
//It takes the two objects as arguments and returns a list of differences. 
//Each entry of the result contains :
//  propertyPath --> the path of the object properties (. separated)
//  value        --> the value of the difference (null if deletion, actual value if addition or update)
const checkArrayIsEmpty = (array: []): boolean => {
    return array.findIndex((val) => val !== undefined) == -1;
}

const findDiffDeep = (obj1: {[id: string]: any}, obj2: {[id: string]: any}, result: ObjectPropertyDiff[], path: string) => {
    const pathSeparator = (path.length > 0) ? "." : "";
    
    for(const obj1property in obj1) {
        const obj1value = obj1[obj1property]
     
        //We first check if the property is defined in obj2
        //--> if yes, we check if there is a difference in the value,
        //--> if no, we notify a deletion in obj2.

        if(obj2[obj1property] !== undefined){
            //To check the difference of value, we need to distinguish the case when the value is:
            // - an object or an array --> then we look for sub values recursively
            // - something else (i.e. string, boolean etc) --> we compare both values from obj1 and obj2
            if(obj1value !== null && typeof obj1value === "object"){
                findDiffDeep(obj1value, obj2[obj1property], result, path + pathSeparator + obj1property + "_" + Array.isArray(obj1value));
                //note: for arrays, delete doesn't change the size of the array, but put "undefined" in the index
                //and that is good for use because in array, indexing MUST be preserved. For example, after this recursion, the array can
                //be [undefined, undefined, x, y] and we want to see x still at the 3rd position and y at the 4th. 
                //That is why we don't check the array has a 0 length to delete, but that it doesn't contain some values != undefined.
                if((Array.isArray(obj1value) && checkArrayIsEmpty(obj2[obj1property])) || Object.entries(obj2[obj1property]).length === 0){
                    //if inside obj2[property] there is no extra property/entry, we delete it
                    delete obj2[obj1property];
                }
            }
            else {
                if(obj2[obj1property] !== obj1value){
                    result.push({propertyPathWithArrayFlag: (path + pathSeparator + obj1property), value: obj2[obj1property]});
                }
                delete obj2[obj1property];
            }

        }
        //else it's a deletion from obj1, put "null" value in the result
        else{
            result.push({propertyPathWithArrayFlag: (path + pathSeparator + obj1property), value: null });
        }
    }
} 

//After using findDiffDeep(), the obj2 may have remaining non empty values.
//These values are changes added in obj2 and need to be saved too.
const checkAddedValues = (obj: {[id: string]: any}, result: ObjectPropertyDiff[], path: string) => {
    const pathSeparator = (path.length > 0) ? "." : "";
    
    for(const objProperty in obj){
        const objValue = obj[objProperty];
        
        if(typeof objValue === "object") {
            //if we have an emty array/object we save it directly,
            //otherwise, we check deeper recursively
            if(Object.entries(objValue).length == 0){
                result.push({propertyPathWithArrayFlag: path + pathSeparator + objProperty, value: objValue});
            } 
            else {
                checkAddedValues(objValue, result, path + pathSeparator + objProperty + "_" + (Array.isArray(objValue)));
            }
        }
        else{
            result.push({propertyPathWithArrayFlag: path + pathSeparator + objProperty, value: objValue});
        }
    }
}

//Entry point for checking the difference between two objects.
//The differnence between obj1 and obj2 is saved as an array of ObjectPropertyDiff objects.
//Note: this is not a bidrectional difference checker: it only checks the difference in obj2 compared with obj1, not keep trace of what is in obj1.
export const getObjectPropertiesDiffferences = (obj1: {[id: string]: any}, obj2: {[id: string]: any}): ObjectPropertyDiff[]  => {
    const result = [] as ObjectPropertyDiff[];
    
    //To find the differences, we'll remove objects from obj2 ---> so we use a copy
    const obj2copy = JSON.parse(JSON.stringify(obj2));

    //we then parse through all properties to find a difference
    //if there is a difference, we add it in the result and remove the property from obj2copy (to keep only additions)
    findDiffDeep(obj1, obj2copy, result, "");

    //at this stage, what is left on obj2copy are the additions that we put this in the result too.
    //note that any property without value isn't an addition (it can be the remaining of the deletion done in the loop above)
    checkAddedValues(obj2copy,result, "");
  
    return result;
}