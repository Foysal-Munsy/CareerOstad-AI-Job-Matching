"use server"

import dbConnect, { collectionNamesObj } from "@/lib/dbConnect";

export const registerUser = async (form) => {
    const userCollection = dbConnect(collectionNamesObj.userCollection);


    // Validation
    const user = await userCollection.findOne({email: form.email})

    if(!user){
        const result = await userCollection.insertOne(form);        
        return result;
    }
}