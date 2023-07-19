import { BsTwitter, BsInstagram, BsFacebook } from "react-icons/bs";
import { FaSnapchatGhost } from "react-icons/fa";

const Footer = () => {
  const icons = [
    <BsTwitter key="twitter" />,
    <BsInstagram key="instagram" />,
    <BsFacebook key="facebook" />,
    <FaSnapchatGhost key="snapchat" />,
  ];
  return (
    <div className="bg-white border-t-2 shadow-md shadow-gray-300 sticky bottom-0 h-20 w-full flex items-center justify-center gap-6">
      {icons.map((icon) => (
        <div className="text-[30px] text-gray-600 hover:text-black duration-100 ease-out" key={icon.key}>
          {icon}
        </div>
      ))}
    </div>
  );
};

export default Footer;