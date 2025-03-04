import React, { useEffect, useRef } from "react";
import { MdChat } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import gsap from "gsap";
import UserSearch from "../components/chatComponents/UserSearch";
import MyChat from "../components/chatComponents/MyChat";
import MessageBox from "../components/messageComponents/MessageBox";
import ChatNotSelected from "../components/chatComponents/ChatNotSelected";
import {
	setChatDetailsBox,
	setSocketConnected,
	setUserSearchBox,
} from "../redux/slices/conditionSlice";
import socket from "../socket/socket";
import { addNewMessage } from "../redux/slices/messageSlice";
import { addNewMessageRecieved } from "../redux/slices/myChatSlice";
import { receivedSound } from "../utils/notificationSound";

const Home = () => {
	const selectedChat = useSelector((store) => store?.myChat?.selectedChat);
	const dispatch = useDispatch();
	const isUserSearchBox = useSelector((store) => store?.condition?.isUserSearchBox);
	const authUserId = useSelector((store) => store?.auth?._id);

	const homePageRef = useRef(null);
	const chatListRef = useRef(null);
	const messageBoxRef = useRef(null);
	const chatButtonRef = useRef(null);

	// GSAP Sidebar Animation
	useEffect(() => {
		if (chatListRef.current) {
			gsap.fromTo(
				chatListRef.current,
				{ x: -50, opacity: 0 },
				{ x: 0, opacity: 1, duration: 1, ease: "power2.out" }
			);
		}
	}, [isUserSearchBox]);

	// GSAP Message Box Animation
	useEffect(() => {
		if (selectedChat && messageBoxRef.current) {
			gsap.fromTo(
				messageBoxRef.current,
				{ scale: 0.9, opacity: 0 },
				{ scale: 1, opacity: 1, duration: 0.6, ease: "elastic.out(1, 0.5)" }
			);
		}
	}, [selectedChat]);

	// Floating Chat Button Animation
	useEffect(() => {
		if (chatButtonRef.current) {
			gsap.to(chatButtonRef.current, {
				y: 8,
				repeat: -1,
				yoyo: true,
				duration: 0.7,
				ease: "power1.inOut",
			});
		}
	}, []);

	// Socket Connection
	useEffect(() => {
		if (!authUserId) return;
		socket.emit("setup", authUserId);
		socket.on("connected", () => dispatch(setSocketConnected(true)));
	}, [authUserId]);

	// Socket Message Received Animation
	useEffect(() => {
		const messageHandler = (newMessageReceived) => {
			if (selectedChat?._id === newMessageReceived.chat._id) {
				dispatch(addNewMessage(newMessageReceived));
			} else {
				receivedSound();
				dispatch(addNewMessageRecieved(newMessageReceived));
			}

			gsap.fromTo(
				".message",
				{ scale: 0.8, opacity: 0 },
				{ scale: 1, opacity: 1, duration: 0.3, ease: "bounce.out" }
			);
		};
		socket.on("message received", messageHandler);

		return () => {
			socket.off("message received", messageHandler);
		};
	}, [selectedChat]);

	return (
		<div
			ref={homePageRef}
			className="home-page flex w-full border border-slate-500 rounded-lg shadow-md 
			relative overflow-hidden bg-black/30 backdrop-blur-lg"
			style={{ 
				backgroundImage: 'url("/dd.jpeg")',
				backgroundSize:'1000px', 
				backgroundPosition: 'right', 
				backgroundRepeat: 'no-repeat',
				backgroundAttachment: 'fixed'
			}}
		>
			{/* Sidebar - Chat List */}
			<div
				ref={chatListRef}
				className={`${
					selectedChat && "hidden"
				} sm:block sm:w-[40%] w-full h-[80vh] bg-black/40 border-r border-slate-500 
				rounded-lg shadow-lg p-2`}
			>
				<div
					ref={chatButtonRef}
					className="absolute bottom-5 right-6 cursor-pointer text-white text-3xl 
					transition-transform hover:scale-110 active:scale-95 
					shadow-md p-2 rounded-full bg-gradient-to-r from-blue-600 to-purple-600"
				>
					<MdChat title="New Chat" onClick={() => dispatch(setUserSearchBox())} />
				</div>
				{isUserSearchBox ? <UserSearch /> : <MyChat />}
			</div>

			{/* Chat Message Box */}
			<div
				ref={messageBoxRef}
				className={`${
					!selectedChat && "hidden"
				} sm:block sm:w-[60%] w-full h-[80vh] bg-black/40 p-2 relative overflow-hidden 
				rounded-lg shadow-lg`}
			>
				{selectedChat ? <MessageBox chatId={selectedChat?._id} /> : <ChatNotSelected />}
			</div>
		</div>
	);
};

export default Home;
