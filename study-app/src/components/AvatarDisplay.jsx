import sampleImage from '../assets/react.svg';
import inchwormAvatar from '../assets/inchwormAvatar.png';
import catAvatar from '../assets/catAvatar.png';
import axolotlAvatar from '../assets/axolotlAvatar.png';
import booksTheme from '../assets/booksTheme.png';
import cactusTheme from '../assets/cactusTheme.png';

//maps avatar name to the image. can't rely on ID since we have multiple DBs 
const avatarPaths = {
    "test": sampleImage,
    "Inchworm Avatar": inchwormAvatar,
    "Cat Avatar": catAvatar,
    "Axolotl Avatar": axolotlAvatar
}

const borderPaths = {
    "test": sampleImage,
    "Books Theme": booksTheme,
    "Cactus Theme": cactusTheme
}

export default function AvatarDisplay({dimension, avatarName, borderName}) {
  return (
    <div
      data-testId="avatar-display-div"
      style={{
        height: dimension,
        width: dimension,
        margin: "0 auto",
        border: "16px solid transparent",
        backgroundImage: `url(${borderPaths[borderName]}), url(${avatarPaths[avatarName]})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    ></div>
  );
}
