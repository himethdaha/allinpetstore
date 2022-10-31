class APIFeatures
{
    constructor(query,queryString)
    {
        this.query = query
        this.queryString = queryString
    }

    //FILTERING 
    filter()
    {
        //Array with keywords NOT to be used in the filter query
        const nonFilters = ['page','sort','limit','fields'];
        //Make a copy of the request query
        let newFilters = {...this.queryString};
        //Remove all the keywords NOT to be used in the filter query, inside the req.query copy
        nonFilters.forEach(el=>{
            if(this.queryString.hasOwnProperty(el))
            {
            delete newFilters[el]
            }
        })

        //If there's relational operators in the request query
        let newqueryString = JSON.stringify(newFilters)
        //Replace the operators with mongodb operators
        newqueryString = newqueryString.replace(/\b(gte|gt|lte|lt)\b/g, (matchedString) => `$${matchedString}`)
        //Get the completed query 
        this.query = petModel.find(JSON.parse(newqueryString))

        return this

    }
    //SORTING
    sort()
    {
        if(this.queryString.sort)
        {
            //With multiple sorts
            const sortBy = this.queryString.sort.split(',').join(' ')
            this.query = this.query.sort(sortBy) 
        }
        //Default sorting by latest
        else
        {
            this.query = this.query.sort('-createdAt')
        }

        return this
    }
    
    //FIELD LIMITING
    limitFields()
    {
        if(this.queryString.fields)
        {
            const fields = this.queryString.fields.split(',').join(' ')
            query = query.select(fields)
        }
        else
        {
            query = query.select('-__v')
        }

        return this
    }


    //PAGINATION
   pagination()
   {
    //Default page
    const page = Number(this.queryString.page) || 1
    //Default limit
    const limit = Number(this.queryString.limit) || 2
    //Documents to skip
    const skip = (page * limit) - limit

    this.query = this.query.skip(skip).limit(limit)

    return this
   } 

   

}

module.exports = APIFeatures