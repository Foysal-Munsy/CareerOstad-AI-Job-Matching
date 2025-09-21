import React from 'react';
import LoginForm from './components/LoginForm';
import dbConnect, { collectionNamesObj } from '@/lib/dbConnect';



const page =  async () => {
    const userCollection = dbConnect(collectionNamesObj.userCollection);
    const data = await userCollection.find({}).toArray();
console.log(data)
    return (
            <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-8 mt-10">
                  <h2 className="text-2xl font-bold mb-6 text-center text-primary">Login to CareerOstad</h2>
            <LoginForm/>
        </div>
    );
};

export default page;