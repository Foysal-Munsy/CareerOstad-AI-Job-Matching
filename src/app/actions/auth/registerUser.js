"use server"

import dbConnect, { collectionNamesObj } from "@/lib/dbConnect";
import bcrypt from "bcrypt";


export const registerUser = async (form) => {
    const userCollection = dbConnect(collectionNamesObj.userCollection);

    const {email, password} = form;


    // Validation
    const user = await userCollection.findOne({email: form.email})

    if(!user){
        
        const hashedPass = await bcrypt.hash(password, 10);

        form.password = hashedPass
        form.confirmPassword = hashedPass


        const result = await userCollection.insertOne(form);        
        return JSON.parse(JSON.stringify(result));
    }
}