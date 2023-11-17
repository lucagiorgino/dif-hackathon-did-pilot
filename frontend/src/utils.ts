export function removeCenterCharacter(inputString: string | null, desiredLength: number) {
    
    if (inputString == null) {
        return "";
    }

    const originalLength = inputString.length;

    if (originalLength <= desiredLength) {
        // If the desired length is greater than or equal to the original length, return the original string
        return inputString;
    }
    
    const halfLenght = Math.floor(desiredLength / 2);
    // Remove characters from both sides
    return inputString.substring(0, halfLenght ) + "..." + inputString.substring(originalLength - halfLenght);
}