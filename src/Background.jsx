import { useEffect, useState } from "react";

function Background(){
    const [stars, setStars] = useState([]);
    


    useEffect(() =>{
        generateStars();

        function handleResize(){
            generateStars();
    };


    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize);


}, []);

  

    function generateStars(){
        const numberOfStars = Math.floor((window.innerHeight * window.innerWidth)/5000);
        const newStars = [];
        for(let i = 0; i < numberOfStars; i++){
            newStars.push({
                id: i,
                size: Math.random() * 3 + 1,
                x: Math.random() * 100,
                y: Math.random() * 100,
                opacity: Math.random() * 0.5 + 0.5,
                animationDuration: Math.random() * 4 + 2
            })
        };
        setStars(newStars);
    } 


    return(
        <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
            {stars.map((star) =>(
                <div className="star animate-bright-stars " key={star.id} style={{
                    width: star.size + "px",
                    height: star.size + "px",
                    left: star.x + "%",
                    top: star.y + "%",
                    opacity: star.opacity,
                    animationDuration: star.animationDuration + "s"
                }} />
            ))}
            
        </div>
    );
}

export default Background;