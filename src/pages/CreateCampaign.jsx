import React, { useState } from 'react'
import { useStateContext } from '../context';
import { useNavigate } from 'react-router-dom'
import Web3 from 'web3';
import { money } from '../assets';
import { CustomButton } from '../components';
import { checkIfImage } from '../utils';
import {FormField} from '../components';
import Loader from '../components/Loader';

const CreateCampaign = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false)

  const { instance, web3 } = useStateContext()

  const [form, setForm] = useState({
    name: '',
    title: '',
    description: '',
    target: '',
    deadline: '',
    image: ''
  })

  const handleFormFieldChange = (fieldName, e) => {
    setForm({ ...form, [fieldName]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    const dateToUint = new Date(form.deadline).getTime()

    checkIfImage(form.image, async(exists) => {
      if(exists) {
        setIsLoading(true)
        try {
          const accounts = await web3.eth.getAccounts();
          const result = await instance.methods.createCampaign(accounts[0], form.title, form.description, Web3.utils.toWei(form.target, 'ether'), dateToUint, form.image).send({ from: accounts[0] })
          console.log(result)

        } catch (error) {
          console.log('Failed to create campaign:', error)
        }
        setIsLoading(false)
        navigate('/');
      } else{
        alert('Provide valid image URL')
        setForm({ ...form, image: '' })
      }
    })
  }

  return (
    <div className='bg-[#1c1c24] flex justify-center items-center flex-col rounded-[10px] sm:p-10 p-4'>
      {isLoading && <Loader />}
      <div className='flex justify-center items-center p-[16px] sm:min-w-[380px] bg-[#3a3a43] rounded-[10px]'>
        <h1 className='font-epilogue font-bold sm:text-[25px] text-[18px] leading-[38px] text-white'>Start a Campaign</h1>
      </div>

      <form onSubmit={handleSubmit} className='w-full mt-[65px] flex flex-col gap-[30px]'>
        <div className='flex flex-wrap gap-[40px]'>
          <FormField 
            labelName="Your Name *"
            placeholder="John Doe"
            inputType="text"
            value={form.name}
            handleChange={(e)=> handleFormFieldChange('name', e)}
          />
          <FormField 
            labelName="Campaign Title *"
            placeholder="Write a title"
            inputType="text"
            value={form.title}
            handleChange={(e)=> handleFormFieldChange('title', e)}
          />

        </div>
        <FormField 
          labelName="Story *"
          placeholder="Write your story"
          isTextArea
          inputType="text"
          value={form.description}
          handleChange={(e)=> handleFormFieldChange('description', e)}
        />

      </form>

      <div className='w-full flex justify-start items-center p-4 bg-[#8c6dfd] h-[120px] rounded-[10px] mt-4'>
        <img src={money} alt='money' className='w-[40px] h-[40px] object-contain' />
        <h4 className='font-epilogue font-bold text-[25px] text-white ml-[20px]'>You will get 100% of the raised amount</h4>
      </div>

      <div className='flex flex-wrap gap-[40px] w-full items items-center mt-4'>
        <FormField 
          labelName="Goal *"
          placeholder="ETH 0.50"
          inputType="text"
          value={form.target}
          handleChange={(e)=> handleFormFieldChange('target', e)}
        />

        <FormField 
          labelName="End Date *"
          placeholder="End Date"
          inputType="date"
          value={form.deadline}
          handleChange={(e)=> handleFormFieldChange('deadline', e)}
        />

        <FormField 
          labelName="Campaign Image *"
          placeholder="Place image URL of your campaign"
          inputType="url"
          value={form.image}
          handleChange={(e)=> handleFormFieldChange('image', e)}
        />


      </div>
      <div className='flex justify-center items-center mt-[40px]'>
          <CustomButton 
            btnType='submit'
            title='Submit new campaign'
            styles='bg-[#1dc071]'
            handleClick={handleSubmit}
          />
        </div>

    </div>
  )
}

export default CreateCampaign