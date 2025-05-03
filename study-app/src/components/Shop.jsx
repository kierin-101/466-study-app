import { useEffect, useState } from "react";
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import AvatarDisplay from "./AvatarDisplay";

// Subcomponent for individual items in the shop, displays them differently based on type (as stored by the server)
const ShopItem = ({itemDetails, displayedPoints, onEquip, onPurchase}) => {

  const canAfford = displayedPoints >= itemDetails.point_cost;

  if (itemDetails.reward_type_id === 1) { // 1 = avatar
    return (
      <div data-testid={`${itemDetails.reward_name} Container`} style={{display: "flex", flexDirection:"column", justifyContent: "center", alignItems: "center", width: "20vw", height:"20vw", borderRadius: "8px", border: "8px solid lightgrey"}}>
        <h3>{itemDetails.reward_name}</h3>
        <AvatarDisplay dimension="10vw" avatarName={itemDetails.reward_name} borderName={null}/>
        <p style={{textAlign:"center"}}>{itemDetails.description}</p>
        {!itemDetails.acquisition_date ? 
          ( <><p><b>Price: </b>{itemDetails.point_cost}</p>
            <button onClick={onPurchase} disabled={!canAfford}>Buy</button></>)
          : (<button onClick={onEquip} disabled={itemDetails.active}>Equip</button>)
        }
      </div>
    )
  } else if (itemDetails.reward_type_id === 2) { // 2 = title
    return (
      <div data-testid={`${itemDetails.reward_name} Container`} style={{display: "flex", flexDirection:"column", justifyContent: "center", alignItems: "center", width: "20vw", height:"20vw", borderRadius: "8px", border: "8px solid lightgrey"}}>
        <h3>{itemDetails.reward_name}</h3>
        <p style={{textAlign:"center"}}>{itemDetails.description}</p>
        {!itemDetails.acquisition_date ? 
          ( <><p><b>Price: </b>{itemDetails.point_cost}</p>
            <button onClick={onPurchase} disabled={!canAfford}>Buy</button></>)
          : (<button onClick={onEquip} disabled={itemDetails.active}>Equip</button>)
        }
      </div>
    )
  } else if (itemDetails.reward_type_id === 3) { // 3 = theme
    return (
      <div data-testid={`${itemDetails.reward_name} Container`} style={{display: "flex", flexDirection:"column", justifyContent: "center", alignItems: "center", width: "20vw", height:"20vw", borderRadius: "8px", border: "8px solid lightgrey"}}>
        <h3>{itemDetails.reward_name}</h3>
        <AvatarDisplay dimension="7vw" avatarName={null} borderName={itemDetails.reward_name}/>
        <p style={{textAlign:"center"}}>{itemDetails.description}</p>
        {!itemDetails.acquisition_date ? 
          ( <><p><b>Price: </b>{itemDetails.point_cost}</p>
            <button onClick={onPurchase} disabled={!canAfford}>Buy</button></>)
          : (<button onClick={onEquip} disabled={itemDetails.active}>Equip</button>)
        }
      </div>
    )
  }
  return;
  
}

const Shop = ({username}) => {

  const [rewardsData, setRewardsData] = useState([]);
  const [previewAvatar, setPreviewAvatar] = useState();
  const [previewTitle, setPreviewTitle] = useState();
  const [previewTheme, setPreviewTheme] = useState();
  const [displayedPoints, setDisplayedPoints] = useState();
  const [refresh, setRefresh] = useState(0);

  // Gets the full list of rewards (including user rewards to determine what is owned and active) from the server.
  // Needs to refresh every time major details (such as user's remaining points) have been changed.
  useEffect(() => {
    // call reward retrieval API
    fetch(`http://localhost:5000/api/shop/rewards`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Failed to retrieve reward data");
        }
      })
      .then((data) => {
        setRewardsData(data);
        setPreviewAvatar((data.filter((reward) => {return reward.active && reward.reward_type_id === 1}))[0]?.reward_name);
        setPreviewTitle((data.filter((reward) => {return reward.active && reward.reward_type_id === 2}))[0]?.reward_name);
        setPreviewTheme((data.filter((reward) => {return reward.active && reward.reward_type_id === 3}))[0]?.reward_name);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
    //get user details
     fetch("http://localhost:5000/api/shop/points", {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Failed to retrieve user data.");
        }
      })
      .then((data) => {
        console.log(data);
        setDisplayedPoints(data.points);
      })
      .catch((error) => {
        console.error("Error:", error);
      })
  }, [refresh]);

  // Asks the server to equip a selected reward (and unequip all rewards of the same type).
  // The refresh triggered by this action will allow the client to update so the equipped reward is displayed.
  const handleEquip = (itemDetails) => {
    const userItem = {
      user_reward_id: itemDetails.user_reward_id
    }
    // call item activation API
    fetch("http://localhost:5000/api/shop/activate", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userItem),
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Reward activation failed.");
        }
      })
      .then((data) => {
        console.log(data);
        setRefresh(refresh+1);
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("Failed to equip the selected reward. Please try again.");
      });
  }

  // Asks the server to purchase a selected reward and deduct points accordingly.
  // The refresh triggered by this action will allow the client to accurately track changes in points.
  const handlePurchase = (itemDetails) => {
    if (window.confirm(`Are you sure you want to purchase ${itemDetails.reward_name} for ${itemDetails.point_cost} points?`)) {
      // call item purchase API
    const rewardInfo = {
      reward_id: itemDetails.reward_id
    }
    fetch("http://localhost:5000/api/shop/purchase", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(rewardInfo),
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Reward purchase failed.");
        }
      })
      .then(() => {
        setRefresh(refresh+1);
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("Failed to purchase the selected reward. Please refresh the page and try again.");
      });
    }
  }

  // Fixed sidebar showing user's active rewards, points, etc.
  const PreviewSidebar = () => {
    return (
        <div style={{height: "100%", width: "30vw", maxWidth: "30vw", background: "lightgrey", position: "fixed"}}>
          <h1 style={{textAlign: "center"}}>Rewards Shop</h1>
          <AvatarDisplay dimension="20vw" avatarName={previewAvatar} borderName={previewTheme} />
          <h1 style={{textAlign: "center"}}>{username}</h1>
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
            {rewardsData.filter((reward) => {return reward.reward_type_id === 1})
              .map((reward) => 
              {return <ShopItem key={`shopDisplay${reward.reward_name}`}  itemDetails={reward} displayedPoints={displayedPoints} onEquip={() => {handleEquip(reward)}} onPurchase={() => {handlePurchase(reward)}} />})}
          </div>
        </TabPanel>
        <TabPanel className="shopTab">
          <h2 style={{marginLeft: "16px"}}>Titles</h2>
          <div className="wrappingSquareList">
            {rewardsData.filter((reward) => {return reward.reward_type_id === 2})
              .map((reward) => 
              {return <ShopItem key={`shopDisplay${reward.reward_name}`} itemDetails={reward} displayedPoints={displayedPoints} onEquip={() => {handleEquip(reward)}} onPurchase={() => {handlePurchase(reward)}} />})}
          </div>
        </TabPanel>
        <TabPanel className="shopTab">
          <h2 style={{marginLeft: "16px"}}>Themes</h2>
          <div className="wrappingSquareList">
            {rewardsData.filter((reward) => {return reward.reward_type_id === 3})
              .map((reward) => 
              {return <ShopItem key={`shopDisplay${reward.reward_name}`} itemDetails={reward} displayedPoints={displayedPoints} onEquip={() => {handleEquip(reward)}} onPurchase={() => {handlePurchase(reward)}} />})}
          </div>
        </TabPanel>
      </Tabs>
      </div>
    </div>
  );
};
export default Shop;
