import { useState } from "react";

const ClassOverview = () => {

  //in an effect hook (presumably, will have to retrieve class data and provide links to all user clases)

  return (
    <div>
      <h1>My Classes</h1>
      <div style={{dislay: "flex"}}>
        <a className="classOverviewLink" href={"/joinClass"}>+</a>
        <a className="classOverviewLink" href={"/createClass"}>new</a>
        <a className="classOverviewLink" href={"/class?a"}>class a</a>
        <a className="classOverviewLink" href={"/class?b"}>class b</a>
      </div>
    </div>
  );
};
export default ClassOverview;
