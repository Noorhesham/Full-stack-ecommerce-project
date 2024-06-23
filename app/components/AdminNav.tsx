import { UserProps } from '@/lib/database/models/UserModel'
import React from 'react'

const AdminNav = ({user}: {user: UserProps}) => {
  return (
    <div className=' bg-white sticky z-50 py-5 px-10  top-0  inset-0 border-b border-gray-400'>
      <div className='flex flex-col justify-center items-start'>
       <h1 className='font-bold text-lg'> Hey There {user.firstName} !</h1>
       <p className='text-sm font-[400] mt-2 text-gray-400 text-muted-foreground'>Here is what is happening with your store today</p>
      </div>
    </div>
  )
}

export default AdminNav
