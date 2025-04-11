import { useState } from "react";
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';

const Shop = () => {

  //in an effect hook (presumably), retrieve reward data including user rewards: items active and owned should still appear but not be buyable
  const [previewAvatar, setPreviewAvatar] = useState();
  const [previewTitle, setPreviewTitle] = useState();
  const [previewTheme, setPreviewTheme] = useState();
  const [displayedPoints, setDisplayedPoints] = useState(100);

  const mockRewards = [
    {
      rewardName: "Avatar 1",
      rewardTypeId: 1,
      description: "A sample avatar.",
      pointsCost: 100,
      isOwned: true
    },
    {
      rewardName: "Aspiring Academic",
      rewardTypeId: 2,
      description: "A title for new studiers.",
      pointsCost: 50
    },
    {
      rewardName: "Avatar 2",
      rewardTypeId: 1,
      description: "A sample avatar.",
      pointsCost: 200
    },
    {
      rewardName: "110%",
      rewardTypeId: 2,
      description: "A sample title.",
      pointsCost: 110,
      isOwned: true,
      isEquipped: true
    },
    {
      rewardName: "Collector of Knowledge",
      rewardTypeId: 2,
      description: "A sample title.",
      pointsCost: 500
    },
    {
      rewardName: "Simple",
      rewardTypeId: 3,
      description: "A sample theme.",
      pointsCost: 110
    },
  ]

  const rewardsData = mockRewards.concat(mockRewards);

  const PreviewSidebar = () => {
    return (
        <div style={{height: "100%", width: "30vw", maxWidth: "30vw", background: "lightgrey", position: "fixed"}}>
          <h1 style={{textAlign: "center"}}>Rewards Shop</h1>
          <div style={{height: "20vw", width: "20vw", margin: "0 auto", borderRadius:"50%", border:"8px solid black", background:"white"}}></div>
          <h1 style={{textAlign: "center"}}>Username</h1>
          <h2 style={{textAlign: "center"}}>Title</h2>
          <p style={{textAlign: "center"}}><b>Points: </b>{displayedPoints}</p>
        </div>
    )
  }

  const listItem = (itemDetails) => {

    const canAfford = displayedPoints >= itemDetails.pointsCost;

    return (
      <div key={`reward${itemDetails.rewardName}`} style={{display: "flex", flexDirection:"column", justifyContent: "center", alignItems: "center", width: "20vw", height:"20vw", borderRadius: "8px", border: "8px solid lightgrey"}}>
        <h3>{itemDetails.rewardName}</h3>
        <div><p>Image goes here eventually...</p></div>
        <p>{itemDetails.description}</p>
        {itemDetails.isOwned ? 
          ( <><p><b>Price: </b>{itemDetails.pointsCost}</p>
            <button disabled={!canAfford}>Buy</button></>)
          : (<button disabled={itemDetails.isEqipped}>Equip</button>)
        }
      </div>
    )
  }

  return (
    <div style={{display: "flex"}}>
      <PreviewSidebar />
      <div style={{width: "100vw", minHeight:"95vh", height:"auto", marginLeft: "30vw"}}>
        <Tabs>
          <TabList>
            <Tab>Avatars</Tab>
            <Tab>Titles</Tab>
            <Tab>Themes</Tab>
          </TabList>
        <TabPanel>
          <h2 style={{marginLeft: "16px"}}>Avatars</h2>
          <div className="wrappingSquareList">
            {rewardsData.filter((reward) => {return reward.rewardTypeId === 1})
              .map((reward) => {return listItem(reward)})}
          </div>
        </TabPanel>
        <TabPanel className="shopTab">
          <h2 style={{marginLeft: "16px"}}>Titles</h2>
          <div className="wrappingSquareList">
            {rewardsData.filter((reward) => {return reward.rewardTypeId === 2})
              .map((reward) => {return listItem(reward)})}
          </div>
        </TabPanel>
        <TabPanel className="shopTab">
          <h2 style={{marginLeft: "16px"}}>Themes</h2>
          <div className="wrappingSquareList">
            {rewardsData.filter((reward) => {return reward.rewardTypeId === 3})
              .map((reward) => {return listItem(reward)})}
          </div>
        </TabPanel>
      </Tabs>
      </div>
    </div>
  );
};
export default Shop;
