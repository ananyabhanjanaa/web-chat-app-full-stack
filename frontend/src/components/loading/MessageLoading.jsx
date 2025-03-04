import React, { useEffect, useRef } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import gsap from "gsap";

const MessageLoading = () => {
	const loaderRef = useRef(null);

	useEffect(() => {
		gsap.fromTo(
			loaderRef.current,
			{ opacity: 0, scale: 0.8 },
			{ opacity: 1, scale: 1, duration: 0.5, ease: "power3.out" }
		);
	}, []);

	return (
		<div className="flex justify-center items-center w-full h-[66vh]">
			<AiOutlineLoading3Quarters
				ref={loaderRef}
				fontSize={30}
				color="white"
				className="animate-spin-fast"
			/>
		</div>
	);
};

export default MessageLoading;

