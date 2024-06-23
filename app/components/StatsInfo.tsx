import React, { ReactNode } from 'react'

const StatsInfo = ({icon,text,count}:{icon:ReactNode,text:string,count:number}) => {
  return (
    <div className='flex bg-white  shadow-md items-stretch py-5 px-10 rounded-lg gap-4'>
      <span className=' text-black flex items-center  bg-gray-300/70 w-12 h-12  justify-center text-3xl rounded-full'>{icon}</span>
      <div className='flex  flex-col gap-2 items-start'>
        <h5 className=' text-gray-400'>{text}</h5>
        <p className='text-gray-950 font-semibold text-muted-foreground'>{count}</p>
      </div>
    </div>
  )
}

export default StatsInfo
