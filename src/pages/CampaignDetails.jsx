import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useStateContext } from '../context'
import { CustomButton } from '../components'
import { calculateBarPercentage, daysLeft } from '../utils'
import { thirdweb } from '../assets'
import { CountBox } from '../components'
import Web3 from 'web3'
import Loader from '../components/Loader'

const CampaignDetails = () => {
  const { state } = useLocation();
  const { instance, web3 } = useStateContext();

  const [isLoading, setIsLoading] = useState(false)
  const [amount, setAmount] = useState('')
  const [donators, setDonators] = useState([])

  const remainingDays = daysLeft(state.deadline)

  const handleDonate = async () => {
    setIsLoading(true);

    // Set a timeout to reset `isLoading` after 25 seconds
    const timeoutId = setTimeout(() => {
      setIsLoading(false);
    }, 25000);

    try {
      const accounts = await web3.eth.getAccounts()
      const result = await instance.methods.donateToCampaign(state.id).send({ from: accounts[0], value: Web3.utils.toWei(amount, 'ether') })
    } catch (error) {
      console.log('Could not donate:', error)
    } finally {
      // Clear the timeout if the operation completes within 25 seconds
      clearTimeout(timeoutId);
      setIsLoading(false);
    }
  }

  const getDonations = async () => {
    try {
      const donations = await instance.methods.getDonators(state.id).call();
      let parsedDonations = []
      const numberOfDonations = donations[0].length

      for(let i=0; i<numberOfDonations; i++) {
        parsedDonations.push({
          donator: donations[0][i],
          donations: Web3.utils.fromWei(donations[1][i], 'ether')
        })
      }

      setDonators(parsedDonations);
    } catch (error) {
      console.log('Failed to fetch donators:', error)
    }
  }

  useEffect(()=>{
    if(instance) getDonations();
  }, [instance, web3])


  return (
    <div>
      {isLoading && <Loader />}

      <div className='w-full flex md:flex-row flex-col mt-10 gap-[30px]'>
        <div className='flex-1 flex-col'>
          <img src={state.image} alt='campaign' className='w-full h-[410px] object-cover rounded-xl' />

          <div className='relative w-full h-[5px] bg-[#3a3a43] mt-2'>
            <div className='absolute h-full bg-[#4acd8d]' style={{ width: `${calculateBarPercentage(state.target, state.amountCollected)}%`, maxWidth: '100%' }}>

            </div>
          </div>
        </div>

        <div className='flex md:w-[150px] w-full flex-wrap justify-between gap-[30px]'>
          <CountBox title='Days Left' value={remainingDays} />
          <CountBox title={`Raised of ${state.target}`} value={state.amountCollected} />
          <CountBox title='Total Backers' value={donators.length} />
        </div>

      </div>

      <div className='mt-[60px] flex flex-col lg:flex-row gap-5'>
        <div className='flex-[2] flex flex-col gap-[40px]'>
          <div>
            <h4 className='font-epilogue font-semibold text-[18px] text-white uppercase'>Creator</h4>

            <div className='mt-[20px] flex flex-row items-center flex-wrap gap-[14px]'>
              <div className='w-[52px] h-[52px] flex items-center justify-center rounded-full bg-[#2c2f32] cursor-pointer'>
                <img src={thirdweb} alt='user' className='w-[60%] h-[60%] object-contain' />
              </div>

              <div>
                <h4 className='font-epilogue font-semibold text-[14px] text-white break-all'>{state.owner}</h4>
                <p className='mt-[4px] font-epilogue font-normal text-[12px] text-[#808191]'>10 Campaigns</p>
              </div>
            </div>
          </div>

          <div>
            <h4 className='font-epilogue font-semibold text-[18px] text-white uppercase'>Story</h4>
            <div className='mt-[20px]'>
              <p className='font-epilogue font-normal text-[16px] leading-[26px] text-[#808191] text-justify'>{state.description}</p>
            </div>
          </div>

          <div>
            <h4 className='font-epilogue font-semibold text-[18px] text-white uppercase'>Donators</h4>
            <div className='mt-[20px] flex flex-col gap-4'>
              {donators.length > 0 ? donators.map((item, index) => (
                <div className='flex justify-between items-center gap-4'>
                  <p className='font-epilogue font-normal text-[16px] text-[#b2b3bd] leading-[26px] break-all'>{index + 1}. {item.donator}</p>
                  <p className='font-epilogue font-normal text-[16px] text-[#808191] leading-[26px] break-all'>{item.donations}</p>
                </div>
              )) :
              <p className='font-epilogue font-normal text-[16px] leading-[26px] text-[#808191] text-justify'>No donators yet, be the first one!</p>

              }
            </div>
          </div>

        </div>

        <div className='flex-1'>
          <h4 className='font-epilogue font-semibold text-[18px] text-white uppercase'>Fund</h4>
          <div className='mt-[20px] flex flex-col p-4 bg-[#1c1c24] rounded-[10px]'>
            <p className='font-epilogue font-medium text-[20px] leading-[30px] text-center text-[#808191]'>Fund the campaign</p>

            <div className='my-[30px]'>
              <input 
                type='number' 
                placeholder='ETH 0.1' 
                step='0.01' 
                className='w-full py-[10px] sm:px[20px] px-[15px] outline-none border-[#3a3a43] border-[1px] bg-transparent text-white text-[18px] leading-[30px] placeholder:text-[#4b5264] rounded-[10px]'
                value={amount}
                onChange={(e)=> setAmount(e.target.value)}
              />

            </div>

            <CustomButton 
              btnType='button'
              title='Fund Campaign'
              styles='w-full bg-[#8c6dfd]'
              handleClick={handleDonate}
            />
          </div>
        </div>

      </div>

    </div>
  )
}

export default CampaignDetails