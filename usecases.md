## USER USE CASES ##
## USER CREATION
1 - User clicks login link in home page nav-bar
    - Check if user exists
        -USER EXISTS
            -Send JWT in response
            -Check user role
                -If STORE OWNER
                    -User profile contains normal user info + links to STORE DETAILS PAGE
                -If REGULAR USER
                    -User profile contains normal user info
            -Take user back to home page with welcome back message
        -!USER EXISTS
            -Render login page again with error messages

2 - User clicks signup link in home page nav-bar
    -Render signup form
        -Validate and Sanitize user input
        -Ask for user role
            -If STORE OWNER/BREEDER
                -Display Store info form
                -Add functionality to add multiple forms
                -Validate and Sanitize store info input
                -SAVE STORE IN DATABASE
        -SAVE USER IN DATABASE
        -Take user back to home page with welcome message


## USER VISITING WEB SITE AND BROWSING WITHOUT LOGGIN IN/SIGNING UP
1 - User visits web site (Everything is viewable by the user)
  - User purchases something / adds to cart
    -Re-direct user to login page
    -User enters login info
        -If USER EXISTS
            - Send JWT in response
            -Check USER ROLE
                -If STORE OWNER/BREEDER
                    -When they click on their own store, they should have CRUD authorities
            - Take user to the page they were viewing before
        -If USER INPUT IS INCORRECT
            - Render the login page again and send in error message saying login info is wrong

    -If user clicks create account in login page
        -Render sign up page with signup form
        -Once user is validated
            -Send JWT in response 
            -Redirect user to previous page they were in


## ITEM PURCHASES USE CASES
1 -To purchase something user must be logged in
2 -User can BUY NOW or ADD TO CART (only itmes, not pets)
3 -When user selects BUY NOW 
    -Take user to payment page
    -Can always remove item from payment page
    -Once user PAYMENT is done
        -DECREMENT ITEM amount from database
4 -When user adds to SHOPPING CART
    -User can select shopping cart and make ADD/DELETE operations to items

## PET PURCHASES USE CASES
1 -To select a pet user must be logged in
2 -USER CAN'T buy live animals from the website
3 -Must send in an application to BREEDER 

## MODELS
## USER MODEL
first_name,last_name_email,password,address,state,postalcode,role
## STORE MODEL
store_name,owner{usermodel._id},address,state,postalcode
## ITEM MODEL
item_name,description,price,quantity,store_name{storemodel._id}
## BREEDER MODEL
breeder_name,owner{usermodel._id},address,state,postalcode
## PET MODEL
pet_name,pet_type,pet_price,pet_breed_,pet_age,pet_color,pet_height/length,pet_weight,pet_hereditery_sicknesses,pet_image,dfescription,breeder{breedermodel._id}
