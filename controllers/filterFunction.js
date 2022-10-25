function filterFunction(reqObj, ...fields)
{   
    //Object to be returned
    const newObj = {}
    //Save the fields found in the request object
    const keys = Object.keys(reqObj)

    //Loop over the request object fields
    keys.forEach((key)=>{
        //If fields in the request object matches allowed fields
        if(fields.includes(key))
        {
            newObj[key] = reqObj[key]
        }
    })
    return newObj
}

module.exports = {filterFunction}

