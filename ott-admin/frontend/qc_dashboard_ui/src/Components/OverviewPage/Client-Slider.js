/**
 * Clients Slider
 */
import { fixedSelectedContent } from "Constants/constant";
import React, { useState } from "react";
import Slider from "react-slick";

function ClientSlider(props) {
   const [title, setTilte] = useState(fixedSelectedContent.epicOn)
   const onClickImage = (name) => {
      setTilte(name)
      props.getImage(name)
   }
   const settings = {
      dots: false,
      infinite: true,
      speed: 1000,
      slidesToShow: 6,
      slidesToScroll: 6,
      autoplay: false,
      rtl: true,
      responsive: [
         {
            breakpoint: 1367,
            settings: {
               slidesToShow: 6,
               slidesToScroll: 6,
               infinite: true
            }
         },
         {
            breakpoint: 575,
            settings: {
               slidesToShow: 3,
               slidesToScroll: 6
            }
         },
         {
            breakpoint: 400,
            settings: {
               slidesToShow: 2,
               slidesToScroll: 6
            }
         }
      ]
   };
   return (
      <div>
         <Slider {...settings}>
            {props.data && props.data.map((client, key) => (
               <div className="monthely-status" key={key}>
                  <img onClick={() => onClickImage(client.name)} src={`${process.env.PUBLIC_URL}/assets/images/img/QC/${client.name}.png`} alt="client log" className={`img-fluid ${client.name === title ? 'selected' : 'not-selected'}`} width="" height="" />
               </div>
            ))}
         </Slider>
            </div>
   );
}

export default ClientSlider;