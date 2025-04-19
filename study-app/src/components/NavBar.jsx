const NavBar = ({loggedIn}) => {
  return (
    <nav style={{ position: 'sticky', top: 0, left: 0, right: 0 }}>
      <style>
        {`
          .nav-item {
            text-decoration: none;
            color: black;
            font-weight: bold;
          }
          .nav-item:hover {
            color: blue;
          }
          ul {
            display: flex;
            list-style-type: none;
            padding: 0;
            margin: 0;
            background-color: lightgrey;
            justify-content: space-around;
            width: 100%;
          }
          li:hover {
            background-color: #ddd;
            border-radius: 5px;
          }
          li a {
            padding: 10px;
            display: block;
          }
          li a:hover {
            background-color: #ddd;
            border-radius: 5px;
          }
        `}
      </style>
      <ul>
        <li><a href="/" className="nav-item">Home</a></li>
        {loggedIn && <li><a href="/shop" className="nav-item">Shop</a></li>}
        {loggedIn && <li><a href="/classes" className="nav-item">Classes</a></li>}
        {!loggedIn && <li><a href="/login" className="nav-item">Login</a></li>}
        {loggedIn && <li><a href="/logout" className="nav-item">Logout</a></li>}
      </ul>
    </nav>
  )
}
export default NavBar