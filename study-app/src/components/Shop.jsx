import { useEffect, useState } from "react";
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import AvatarDisplay from "./AvatarDisplay";


const mockRewards = [
  {
    rewardName: "Inchworm Avatar",
    rewardTypeId: 1,
    description: "An avatar for all users.",
    pointsCost: 0,
    isOwned: true,
    isActive: true
  },
  {
    rewardName: "Axolotl Avatar",
    rewardTypeId: 1,
    description: "An excellent use of Katelyn's time.",
    pointsCost: 200,
    isOwned: true,
    isActive: false
  },
  {
    rewardName: "Aspiring Academic",
    rewardTypeId: 2,
    description: "A title for new studiers.",
    pointsCost: 0,
    isOwned: true,
    isActive: true
  },
  {
    rewardName: "Cat Avatar",
    rewardTypeId: 1,
    description: "Another excellent use of Katelyn's time.",
    pointsCost: 100,
    isOwned: false,
    isActive: false
  },
  {
    rewardName: "110%",
    rewardTypeId: 2,
    description: "Giving it 110% what can I say",
    pointsCost: 110,
    isOwned: true,
    isActive: false
  },
  {
    rewardName: "Collector of Knowledge",
    rewardTypeId: 2,
    description: "For students with a truly impressive number of points.",
    pointsCost: 500,
    isOwned: false,
    isActive: false
  },
  {
    rewardName: "Cactus Theme",
    rewardTypeId: 3,
    description: "It's cacti.",
    pointsCost: 300,
    isOwned: false,
    isActive: false
  },
  {
    rewardName: "Quality Quizzer",
    rewardTypeId: 2,
    description: "when the quizzes are quality",
    pointsCost: 200,
    isOwned: true,
    isActive: true
  },
  {
    rewardName: "Books Theme",
    rewardTypeId: 3,
    description: "Roughly drawn books.",
    pointsCost: 100,
    isOwned: false,
    isActive: false
  },
]

const ShopItem = ({itemDetails, displayedPoints, onEquip, onPurchase}) => {

  const canAfford = displayedPoints >= itemDetails.pointsCost;

  if (itemDetails.rewardTypeId === 1) {
    return (
      <div key={`reward${itemDetails.rewardName}`} style={{display: "flex", flexDirection:"column", justifyContent: "center", alignItems: "center", width: "20vw", height:"20vw", borderRadius: "8px", border: "8px solid lightgrey"}}>
        <h3>{itemDetails.rewardName}</h3>
        <AvatarDisplay dimension="10vw" avatarName={itemDetails.rewardName} borderName={null}/>
        <p style={{textAlign:"center"}}>{itemDetails.description}</p>
        {!itemDetails.isOwned ? 
          ( <><p><b>Price: </b>{itemDetails.pointsCost}</p>
            <button onClick={onPurchase} disabled={!canAfford}>Buy</button></>)
          : (<button onClick={onEquip} disabled={itemDetails.isActive}>Equip</button>)
        }
      </div>
    )
  } else if (itemDetails.rewardTypeId === 2) {
    return (
      <div key={`reward${itemDetails.rewardName}`} style={{display: "flex", flexDirection:"column", justifyContent: "center", alignItems: "center", width: "20vw", height:"20vw", borderRadius: "8px", border: "8px solid lightgrey"}}>
        <h3>{itemDetails.rewardName}</h3>
        <p style={{textAlign:"center"}}>{itemDetails.description}</p>
        {!itemDetails.isOwned ? 
          ( <><p><b>Price: </b>{itemDetails.pointsCost}</p>
            <button onClick={onPurchase} disabled={!canAfford}>Buy</button></>)
          : (<button onClick={onEquip} disabled={itemDetails.isActive}>Equip</button>)
        }
      </div>
    )
  } else if (itemDetails.rewardTypeId === 3) {
    return (
      <div key={`reward${itemDetails.rewardName}`} style={{display: "flex", flexDirection:"column", justifyContent: "center", alignItems: "center", width: "20vw", height:"20vw", borderRadius: "8px", border: "8px solid lightgrey"}}>
        <h3>{itemDetails.rewardName}</h3>
        <AvatarDisplay dimension="7vw" avatarName={null} borderName={itemDetails.rewardName}/>
        <p style={{textAlign:"center"}}>{itemDetails.description}</p>
        {!itemDetails.isOwned ? 
          ( <><p><b>Price: </b>{itemDetails.pointsCost}</p>
            <button onClick={onPurchase} disabled={!canAfford}>Buy</button></>)
          : (<button onClick={onEquip} disabled={itemDetails.isActive}>Equip</button>)
        }
      </div>
    )
  }
  return;
  
}

const Shop = () => {

  //in an effect hook (presumably), retrieve reward data including user rewards: items active and owned should still appear but not be buyable
  const [rewardsData, setRewardsData] = useState(mockRewards);
  const [refreshData, setRefreshData] = useState(false); //not needed yet but probably will be for db refetching purposes
  const [previewAvatar, setPreviewAvatar] = useState("Inchworm Avatar");
  const [previewTitle, setPreviewTitle] = useState("Aspiring Academic");
  const [previewTheme, setPreviewTheme] = useState();
  const [displayedPoints, setDisplayedPoints] = useState(200);

  // useEffect(() => {
  //   //actual db stuff
  //   if (refreshData) {
  //     setRewardsData(mockRewards);
  //     setRefreshData(false);
  //   }
  // }, [refreshData]);

  const handleEquip = (itemDetails) => {
    //for mocking purposes
    mockRewards.forEach((reward) => {if (reward.rewardTypeId === itemDetails.rewardTypeId) {reward.isActive = false}});
    itemDetails.isActive = true;
    //setRefreshData(true);
  }

  const handlePurchase = (itemDetails) => {
    //for mocking purposes
    itemDetails.isOwned = true;
    setDisplayedPoints(displayedPoints - itemDetails.pointsCost);
    //setRefreshData(true);
  }


  const PreviewSidebar = () => {
    return (
        <div style={{height: "100%", width: "30vw", maxWidth: "30vw", background: "lightgrey", position: "fixed"}}>
          <h1 style={{textAlign: "center"}}>Rewards Shop</h1>
          <AvatarDisplay dimension="20vw" avatarName={previewAvatar} borderName={previewTheme} />
          <h1 style={{textAlign: "center"}}>Username</h1>
          <h2 style={{textAlign: "center"}}>{previewTitle}</h2>
          <p style={{textAlign: "center"}}><b>Points: </b>{displayedPoints}</p>
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
              .map((reward) => 
              {return <ShopItem itemDetails={reward} displayedPoints={displayedPoints} onEquip={() => {handleEquip(reward); setPreviewAvatar(reward.rewardName)}} onPurchase={() => {handlePurchase(reward)}} />})}
          </div>
        </TabPanel>
        <TabPanel className="shopTab">
          <h2 style={{marginLeft: "16px"}}>Titles</h2>
          <div className="wrappingSquareList">
            {rewardsData.filter((reward) => {return reward.rewardTypeId === 2})
              .map((reward) => 
              {return <ShopItem itemDetails={reward} displayedPoints={displayedPoints} onEquip={() => {handleEquip(reward); setPreviewTitle(reward.rewardName);}} onPurchase={() => {handlePurchase(reward)}} />})}
          </div>
        </TabPanel>
        <TabPanel className="shopTab">
          <h2 style={{marginLeft: "16px"}}>Themes</h2>
          <div className="wrappingSquareList">
            {rewardsData.filter((reward) => {return reward.rewardTypeId === 3})
              .map((reward) => 
              {return <ShopItem itemDetails={reward} displayedPoints={displayedPoints} onEquip={() => {handleEquip(reward); setPreviewTheme(reward.rewardName);}} onPurchase={() => {handlePurchase(reward)}} />})}
          </div>
        </TabPanel>
      </Tabs>
      </div>
    </div>
  );
};
export default Shop;
