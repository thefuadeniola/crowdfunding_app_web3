import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { CustomButton } from './'
import { logo, menu, search, thirdweb } from '../assets'
import { navlinks } from '../constants'
import { useStateContext } from '../context'

const Navbar = () => {

  const navigate = useNavigate();
  const [windowWallet, setWindowWallet] = useState(true)
  const [isActive, setIsActive] = useState('dashboard');
  const [toggleDrawer, setToggleDrawer] = useState('false')
  const { web3, connect } = useStateContext();

  const checkWallet = async () => {
    try {
      const accounts = await web3.eth.getAccounts();
      if(!accounts[0]) setWindowWallet(false)    
    } catch (error) {
      console.log('Error detecting wallet:', error)
    }
  }

  useEffect(()=>{
    if(web3) checkWallet();
  }, 
  [web3])

  return (
    <div className='flex md:flex-row flex-col-reverse justify-between mb-[35px] gap-6'>
      <div className='lg:flex-1 flex flex-row max-w-[458px] py-2 pl-4 pr-2 h-[52px] bg-[#1c1c24] rounded-2xl'>
        <input type='text' placeholder='Search for campaigns' className='flex w-full font-epilogue font-normal text-[14px] placeholder:text-[#4b5264] text-white bg-transparent outline-none'/>

        <div className='w-[72px] h-full rounded-[20px] bg-[#4acd8d] flex justify-center items-center cursor-pointer'>
          <img src={search} alt={search} className='w-[15px] h-[15px] object-contain' />
        </div>

      </div>
      <div className='sm:flex items-center hidden flex-row justify-end gap-4'>
          <CustomButton 
            btnType="button"
            title={windowWallet ? 'Create a campaign' : 'Connect'}
            styles={windowWallet ? 'bg-[#1dc071]' : 'bg-[#8c6dfd]'}
            handleClick={() => {
              if(windowWallet) navigate('create-campaign')
              else connect()
            }}
          />

          <Link to='/profile'>
            <div className='w-[52px] h-[40px] rounded-full bg-[#2c2f32] flex justify-center items-center cursor-pointer'>
              <img src={thirdweb} alt='user' className='w-[60%] h-[60%] object-contain'/>
            </div>
          </Link>
        </div>

        {/* Small Screen Navigation */}

        <div className='sm:hidden flex justify-between items-center relative'>
            <div className='w-[40px] h-[40px] rounded-[10px] bg-[#2c2f32] flex justify-center items-center cursor-pointer'>
              <img src={thirdweb} alt='user' className='w-[60%] h-[60%] object-contain'/>
            </div>

            <img src={menu} alt='menu' className='w-[34px] h-[34px] object-contain cursor-pointer' 
              onClick={() => setToggleDrawer(oldtoggle => !oldtoggle)} 
            />

            <div className={`absolute top-[60px] right-0 left-0 bg-[#1c1c24] z-10 shadow-secondary py-4 ${!toggleDrawer ? '-translate-y-[100vh]' : 'translate-y-0'} transition-all duration-700`}>
              <ul className='mb-4'>
                {navlinks.map((link) => (
                  <li key={link.name} className={`flex p-4 ${isActive === link.name && 'bg-[#3a3a43]'} cursor-pointer`}
                    onClick={() => {
                      setIsActive(link.name);
                      setToggleDrawer(false);
                      navigate(link.link)
                    }}
                  >
                    <img 
                      className={`w-[24px] h-[24px] object-contain ${isActive === link.name ? 'grayscale-0' : 'grayscale'}`}
                      src={link.imgUrl} alt={link.name}
                    />
                    <p className={`ml-[20px] font-epilogue font-semibold text-[14px] ${isActive === link.name ? 'text-[#1dc071]' : 'text-[#808191]'} `}>{link.name}</p>
                  </li>
                ))}
              </ul>

              <div className='flex mx-4'>
                <CustomButton 
                  btnType="button"
                  title={windowWallet ? 'Create a campaign' : 'Connect'}
                  styles={windowWallet ? 'bg-[#1dc071]' : 'bg-[#8c6dfd]'}
                  handleClick={() => {
                    if(windowWallet) navigate('create-campaign')
                    else connect()
                  }}
                />
              </div>
            </div>
        </div>


    </div>
  )
}

export default Navbar