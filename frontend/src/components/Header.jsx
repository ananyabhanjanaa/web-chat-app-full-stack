import React, { useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addAuth } from "../redux/slices/authSlice";
import handleScrollTop from "../utils/handleScrollTop";
import {
	MdKeyboardArrowDown,
	MdKeyboardArrowUp,
	MdNotificationsActive,
} from "react-icons/md";
import {
	setHeaderMenu,
	setLoading,
	setNotificationBox,
	setProfileDetail,
} from "../redux/slices/conditionSlice";
import { IoLogOutOutline } from "react-icons/io5";
import { PiUserCircleLight } from "react-icons/pi";
import Logo from "../assets/logo.jpeg";

const Header = () => {
	const user = useSelector((store) => store.auth);
	const isHeaderMenu = useSelector((store) => store?.condition?.isHeaderMenu);
	const newMessageRecieved = useSelector(
		(store) => store?.myChat?.newMessageRecieved
	);
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const token = localStorage.getItem("token");

	const getAuthUser = async (token) => {
		dispatch(setLoading(true));
		try {
			const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/user/profile`, {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
			});
			const json = await res.json();
			dispatch(addAuth(json.data));
		} catch (err) {
			console.error("Error fetching user:", err);
		} finally {
			dispatch(setLoading(false));
		}
	};

	useEffect(() => {
		if (token) getAuthUser(token);
		dispatch(setHeaderMenu(false));
	}, [token, dispatch]);

	// Handle redirection based on authentication state
	const { pathname } = useLocation();
	useEffect(() => {
		if (!user && pathname !== "/signin" && pathname !== "/signup") {
			navigate("/signin");
		}
		handleScrollTop();
	}, [pathname, user, navigate]);

	const handleLogout = () => {
		localStorage.removeItem("token");
		dispatch(addAuth(null));
		navigate("/signin");
	};

	// Scroll Animation for Header
	useEffect(() => {
		let prevScrollPos = window.pageYOffset;
		const handleScroll = () => {
			requestAnimationFrame(() => {
				const currentScrollPos = window.pageYOffset;
				document.getElementById("header").classList.toggle(
					"hiddenbox",
					prevScrollPos < currentScrollPos && currentScrollPos > 80
				);
				prevScrollPos = currentScrollPos;
			});
		};
		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	// Click outside handler for closing menu
	const headerMenuBox = useRef(null);
	const headerUserBox = useRef(null);
	const handleClickOutside = (event) => {
		if (
			headerMenuBox.current &&
			!headerUserBox?.current?.contains(event.target) &&
			!headerMenuBox.current.contains(event.target)
		) {
			dispatch(setHeaderMenu(false));
		}
	};

	useEffect(() => {
		if (isHeaderMenu) {
			document.addEventListener("mousedown", handleClickOutside);
		}
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, [isHeaderMenu]);

	return (
		<div
			id="header"
			className="w-full h-16 fixed top-0 z-50 md:h-20 shadow-lg flex justify-between items-center px-6 font-semibold bg-gradient-to-r from-gray-900 to-gray-800 text-white transition-all"
		>
			{/* Logo & Name */}
			<div className="flex items-center gap-2">
				<Link to={"/"}>
					<img
						src={Logo}
						alt="ChatApp"
						className="h-12 w-12 rounded-full shadow-md hover:scale-110 transition-all"
					/>
				</Link>
				<Link to={"/"} className="text-lg font-bold tracking-wide">
					ChatApp
				</Link>
			</div>

			{/* User Authenticated Section */}
			{user ? (
				<div className="flex items-center space-x-4">
					{/* Notification Bell */}
					<span
						className={`relative cursor-pointer ${
							newMessageRecieved.length > 0 ? "animate-bounce" : ""
						}`}
						title={`You have ${newMessageRecieved.length} new notifications`}
						onClick={() => dispatch(setNotificationBox(true))}
					>
						<MdNotificationsActive fontSize={25} />
						{newMessageRecieved.length > 0 && (
							<span className="absolute top-0 right-0 bg-red-600 text-xs text-white rounded-full px-1.5">
								{newMessageRecieved.length}
							</span>
						)}
					</span>

					{/* User Name */}
					<span className="text-md font-medium">Hi, {user.firstName}</span>

					{/* Profile Dropdown */}
					<div
						ref={headerUserBox}
						onClick={() => dispatch(setHeaderMenu(!isHeaderMenu))}
						className="flex items-center border border-gray-600 rounded-full bg-gray-700 hover:bg-gray-600 p-1 cursor-pointer transition-all"
					>
						<img src={user.image} alt="profile" className="w-10 h-10 rounded-full" />
						<span className="ml-2 text-xl">
							{isHeaderMenu ? <MdKeyboardArrowDown /> : <MdKeyboardArrowUp />}
						</span>
					</div>

					{/* Dropdown Menu */}
					{isHeaderMenu && (
						<div
							ref={headerMenuBox}
							className="absolute top-16 right-4 w-44 py-2 flex flex-col bg-gray-800 border border-gray-600 rounded-md shadow-lg z-40"
						>
							{/* Profile Option */}
							<div
								onClick={() => {
									dispatch(setHeaderMenu(false));
									dispatch(setProfileDetail());
								}}
								className="flex items-center px-4 py-2 hover:bg-gray-700 cursor-pointer"
							>
								<PiUserCircleLight className="mr-2 text-lg" />
								<span>Profile</span>
							</div>

							{/* Logout Option */}
							<div
								className="flex items-center px-4 py-2 hover:bg-gray-700 cursor-pointer"
								onClick={handleLogout}
							>
								<IoLogOutOutline className="mr-2 text-lg" />
								<span>Logout</span>
							</div>
						</div>
					)}
				</div>
			) : (
				<Link to={"/signin"}>
					<button className="py-2 px-6 border border-gray-500 rounded-full bg-gradient-to-r from-gray-700 to-gray-600 hover:bg-gray-500 shadow-md transition-all">
						Sign In
					</button>
				</Link>
			)}
		</div>
	);
};

export default Header;
