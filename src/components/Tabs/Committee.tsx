import React from 'react'
import CommitteeCore from './CommitteeCore'
import CommitteeMembers from './CommitteeMembers'

const Committee = () => {
  return (
    <div className='flex w-full md:flex-row flex-col gap-20 justify-center'>
      <CommitteeCore/>
      <CommitteeMembers/>
    </div>
  )
}

export default Committee
