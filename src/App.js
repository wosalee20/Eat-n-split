import React, { useState } from "react";
// import crypto from "crypto"; // Added import for crypto

const initialFriends = [
	{
		id: 118836,
		name: "Clark",
		image: "https://i.pravatar.cc/48?u=118836",
		balance: -7,
	},
	{
		id: 933372,
		name: "Sarah",
		image: "https://i.pravatar.cc/48?u=933372",
		balance: 20,
	},
	{
		id: 499476,
		name: "Anthony",
		image: "https://i.pravatar.cc/48?u=499476",
		balance: 0,
	},
];

function Button({ children, onClick }) {
	return (
		<button className="button" onClick={onClick}>
			{" "}
			{children}{" "}
		</button>
	);
}

export default function App() {
	const [friends, setFriends] = useState(initialFriends);
	const [showAddFriend, setShowAddFriend] = useState(false);
	const [selectedFriend, setSelectedFriend] = useState(null);

	function handleShowAddFriend() {
		setShowAddFriend((show) => !show);
	}

	function handleAddFriend(friend) {
		setFriends((friends) => [...friends, friend]);
		setShowAddFriend(false);
	}

	function handleSelection(friend) {
		setSelectedFriend((cur) => (cur?.id === friend.id ? null : friend));
		setShowAddFriend(false);
	}

	function handleSplitBill(value) {
		setFriends((friends) =>
			friends.map((friend) =>
				friend.id === selectedFriend.id
					? { ...friend, balance: friend.balance + value } // Fixed variable name
					: friend
			)
		);
		setSelectedFriend(null);
	}

	return (
		<div className="app">
			<div className="sidebar">
				<FriendList
					friends={friends}
					onSelection={handleSelection}
					selectedFriend={selectedFriend}
				/>

				{showAddFriend && <FormAddFriend onAddFriend={handleAddFriend} />}

				<Button onClick={handleShowAddFriend}>
					{showAddFriend ? "Close" : "Add friend"}
				</Button>
			</div>

			{selectedFriend && (
				<FormSplitBill
					selectedFriend={selectedFriend}
					onSplitBill={handleSplitBill}
				/>
			)}
		</div>
	);
}

function FriendList({ friends, onSelection, selectedFriend }) {
	return (
		<ul>
			{friends.map((friend) => (
				<Friend
					friend={friend}
					key={friend.id}
					onSelection={onSelection}
					selectedFriend={selectedFriend}
				/>
			))}
		</ul>
	);
}

function Friend({ friend, onSelection, selectedFriend }) {
	const isSelected = selectedFriend?.id === friend.id;
	return (
		<li className={isSelected ? "selected" : ""}>
			<img src={friend.image} alt={friend.name} />
			<h3>{friend.name}</h3>

			{friend.balance < 0 && (
				<p className="red">
					{" "}
					You owe {friend.name} {Math.abs(friend.balance)}$
				</p>
			)}
			{friend.balance > 0 && (
				<p className="green">
					{" "}
					{friend.name} owes you {Math.abs(friend.balance)}$
				</p>
			)}
			{friend.balance === 0 && <p>You and {friend.name} are even</p>}
			<Button onClick={() => onSelection(friend)}>
				{" "}
				{isSelected ? "Close" : "Select"}{" "}
			</Button>
		</li>
	);
}

function FormAddFriend({ onAddFriend }) {
	const [name, setName] = useState("");
	const [image, setImage] = useState("https://i.pravatar.cc/48");

	function handleSubmit(e) {
		e.preventDefault();

		if (!name || !image) return alert("Please fill in the input options");

		const id = crypto.randomUUID(); // Use crypto.randomUUID() to generate a random ID
		const newFriend = {
			id,
			name,
			image: `${image}?u=${id}`, // Updated image URL generation
			balance: 0,
		};

		setName("");
		setImage("https://i.pravatar.cc/48");

		onAddFriend(newFriend);
	}

	return (
		<form className="form-add-friend" onSubmit={handleSubmit}>
			<label>👬Friend name</label>
			<input
				type="text"
				value={name}
				onChange={(e) => setName(e.target.value)}
			/>
			<label>📷 Image Url</label>
			<input
				type="text"
				value={image}
				onChange={(e) => setImage(e.target.value)}
			/>
			<Button> Add Friend</Button>
		</form>
	);
}

function FormSplitBill({ selectedFriend, onSplitBill }) {
	const [bill, setBill] = useState(0); // Initialize bill and paidByUser to 0
	const [paidByUser, setPaidByUser] = useState(0);
	const paidByFriend = bill ? bill - paidByUser : "";
	const [whoIsPaying, setWhoIsPaying] = useState("user");

	function handleSubmit(e) {
		e.preventDefault();

		if (!bill || !paidByUser)
			return alert("Please input the required field(s)");
		onSplitBill(whoIsPaying === "user" ? paidByFriend : -paidByUser);
	}

	return (
		<form className="form-split-bill" onSubmit={handleSubmit}>
			<h2>Split a Bill with {selectedFriend.name}</h2>

			<label> 💸Bill value</label>
			<input
				type="text"
				value={bill}
				onChange={(e) => setBill(Number(e.target.value))}
			/>

			<label> 🕴🏽Your expense</label>
			<input
				type="text"
				value={paidByUser}
				onChange={(e) =>
					setPaidByUser(
						parseFloat(e.target.value) > bill
							? paidByUser
							: Number(e.target.value)
					)
				}
			/>

			{whoIsPaying === "user" && ( // Conditionally render based on who is paying
				<label> 👬 {selectedFriend.name}'s expense</label>
			)}
			{whoIsPaying === "user" && (
				<input type="text" disabled value={paidByFriend} />
			)}

			<label> 🤑Who is paying the bill</label>
			<select
				value={whoIsPaying}
				onChange={(e) => setWhoIsPaying(e.target.value)}
			>
				<option value="user">You</option>
				<option value="Friend">{selectedFriend.name}</option>
			</select>

			<Button> Split bill</Button>
		</form>
	);
}
