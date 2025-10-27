import HomepageVerification from '@/components/verification/HomepageVerification'
import React from 'react'

export default function getVerified() {
  return (
    <div>
        <h1 className='text-5xl text-center font-extrabold bg-gradient-to-r from-primary to-secondary text-primary-content py-16 px-19'>
            Get Your Profile verified & unveil the premium features
        </h1>
      <HomepageVerification></HomepageVerification>
    </div>
  )
}
