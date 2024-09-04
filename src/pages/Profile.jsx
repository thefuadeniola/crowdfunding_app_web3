import React , { useState, useEffect } from 'react'
import { useStateContext } from '../context'
import Web3 from 'web3';
import { DisplayCampaigns } from '../components';

const Profile = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [campaigns, setCampaigns] = useState([]);
  const { instance, web3 } = useStateContext()

  const getCampaigns = async () => {
    try {
      setIsLoading(true)
      const allCampaigns = await instance.methods.getCampaigns().call()
      const accounts = await web3.eth.getAccounts();
      const currentAccount = accounts[0] 
      const filteredCampaigns = allCampaigns.filter((campaign) => campaign.owner === currentAccount)

      const parsedCampaigns = await filteredCampaigns.map((campaign) => ({
        owner: campaign.owner,
        title: campaign.title,
        description: campaign.description,
        target: Web3.utils.fromWei(campaign.target, 'ether'),
        deadline: Number(campaign.deadline),
        amountCollected: Web3.utils.fromWei(campaign.amountCollected, 'ether'),
        image: campaign.image
      }))

      setCampaigns(parsedCampaigns)
      setIsLoading(false)
    } catch (error) {
      console.log('Failed to fetch campaigns:', error)
    }
  }

  useEffect(() => {
    if(instance) getCampaigns();
  }, [instance])

  return (
    <DisplayCampaigns 
      title="Campaigns by You"
      isLoading={isLoading}
      campaigns={campaigns}
    />
  )
}

export default Profile