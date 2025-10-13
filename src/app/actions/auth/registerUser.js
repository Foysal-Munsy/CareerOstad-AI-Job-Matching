"use server"

import dbConnect, { collectionNamesObj } from "@/lib/dbConnect";
import bcrypt from "bcrypt";


export const registerUser = async (form) => {
    const userCollection = await dbConnect(collectionNamesObj.userCollection);

    const {email, password} = form;

    //console.log('Registering user with form:', form);

    // Validation
    const user = await userCollection.findOne({email: form.email})

    if(!user){
        
        const hashedPass = await bcrypt.hash(password, 10);

        form.password = hashedPass
        form.confirmPassword = hashedPass
        // Set role based on userType for compatibility
        //form.role = userType || 'candidate';
        
        console.log('User data to be saved:', form);

        const result = await userCollection.insertOne(form);        
        return JSON.parse(JSON.stringify(result));
    }
}