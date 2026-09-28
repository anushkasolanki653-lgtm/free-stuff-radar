/*
    FREE STUFF RADAR
    Frontend MVP

    This version uses local mock data.
    Later we will replace this with an AWS backend/database.
*/


// --------------------------------------------------
// MOCK DATA
// --------------------------------------------------

let items = [

    {
        id: 1,
        title: "Engineering Mathematics Textbook",
        category: "Books",
        description: "First-year engineering mathematics book. Good condition.",
        location: "Central Library",
        emoji: "📚",
        expiresAt: Date.now() + 18 * 60 * 60 * 1000,
        urgent: false,
        poster: "Rahul"
    },

    {
        id: 2,
        title: "Study Chair",
        category: "Furniture",
        description: "Comfortable wooden study chair. Moving out of hostel.",
        location: "Hostel Block A",
        emoji: "🪑",
        expiresAt: Date.now() + 7 * 60 * 60 * 1000,
        urgent: true,
        poster: "Priya"
    },

    {
        id: 3,
        title: "USB Keyboard",
        category: "Electronics",
        description: "Working USB keyboard. No longer needed.",
        location: "Computer Science Block",
        emoji: "⌨️",
        expiresAt: Date.now() + 30 * 60 * 60 * 1000,
        urgent: false,
        poster: "Aman"
    },

    {
        id: 4,
        title: "College Notebook Set",
        category: "Books",
        description: "Several unused notebooks from last semester.",
        location: "Hostel Block B",
        emoji: "📓",
        expiresAt: Date.now() + 24 * 60 * 60 * 1000,
        urgent: false,
        poster: "Sneha"
    },

    {
        id: 5,
        title: "Desk Lamp",
        category: "Furniture",
        description: "Small LED desk lamp. Works perfectly.",
        location: "Girls Hostel",
        emoji: "💡",
        expiresAt: Date.now() + 12 * 60 * 60 * 1000,
        urgent: false,
        poster: "Meera"
    },

    {
        id: 6,
        title: "Packaged Snacks",
        category: "Food",
        description: "Unused packaged snacks from a college event.",
        location: "Student Activity Center",
        emoji: "🍪",
        expiresAt: Date.now() + 5 * 60 * 60 * 1000,
        urgent: true,
        poster: "Arjun"
    }

];


// --------------------------------------------------
// DISPLAY ITEMS
// --------------------------------------------------

function displayItems(category = "All") {

    const grid = document.getElementById("itemsGrid");

    grid.innerHTML = "";

    const now = Date.now();

    // Remove expired items from display
    const activeItems = items.filter(item => item.expiresAt > now);

    let filteredItems = activeItems;

    if (category !== "All") {

        filteredItems = activeItems.filter(
            item => item.category === category
        );

    }

    if (filteredItems.length === 0) {

        grid.innerHTML = `
            <div style="grid-column: 1 / -1; text-align:center; padding:60px;">
                <h3>No items available right now.</h3>
                <p style="color:#68756f;">
                    Check another category or post something for someone else.
                </p>
            </div>
        `;

        return;
    }


    filteredItems.forEach(item => {

        const card = document.createElement("div");

        card.className = "item-card";

        card.innerHTML = `

            <div class="item-image">
                ${item.emoji}
            </div>

            <div class="item-content">

                <div class="item-top">

                    <span class="category">
                        ${item.category}
                    </span>

                    ${
                        item.urgent
                        ? `<span class="urgent">URGENT</span>`
                        : ""
                    }

                </div>

                <h3 class="item-title">
                    ${item.title}
                </h3>

                <p class="item-description">
                    ${item.description}
                </p>

                <div class="item-info">

                    <span>
                        📍 ${item.location}
                    </span>

                    <span class="expiry">
                        ⏰ ${getTimeRemaining(item.expiresAt)}
                    </span>

                </div>

                <button
                    class="claim-btn"
                    onclick="openClaimModal(${item.id})"
                >
                    I WANT THIS
                </button>

            </div>

        `;

        grid.appendChild(card);

    });

}


// --------------------------------------------------
// EXPIRY COUNTDOWN
// --------------------------------------------------

function getTimeRemaining(expiry) {

    const difference = expiry - Date.now();

    if (difference <= 0) {
        return "Expired";
    }

    const hours = Math.floor(
        difference / (1000 * 60 * 60)
    );

    const minutes = Math.floor(
        (difference % (1000 * 60 * 60)) /
        (1000 * 60)
    );

    if (hours > 0) {

        return `${hours}h ${minutes}m left`;

    }

    return `${minutes}m left`;

}


// Refresh countdown every minute

setInterval(() => {

    displayItems();

}, 60000);


// --------------------------------------------------
// FILTERING
// --------------------------------------------------

function filterItems(category, button) {

    document
        .querySelectorAll(".filter")
        .forEach(btn => btn.classList.remove("active"));

    button.classList.add("active");

    displayItems(category);

}


// --------------------------------------------------
// POST MODAL
// --------------------------------------------------

function openPostModal() {

    document
        .getElementById("postModal")
        .classList.add("show");

}


function closePostModal() {

    document
        .getElementById("postModal")
        .classList.remove("show");

}


// --------------------------------------------------
// POST ITEM
// --------------------------------------------------

document
    .getElementById("postForm")
    .addEventListener("submit", function(event) {

        event.preventDefault();


        const name =
            document.getElementById("itemName").value;

        const category =
            document.getElementById("itemCategory").value;

        const description =
            document.getElementById("itemDescription").value;

        const location =
            document.getElementById("itemLocation").value;

        const deadline =
            new Date(
                document.getElementById("itemDeadline").value
            ).getTime();

        const poster =
            document.getElementById("posterName").value;

        const email =
            document.getElementById("posterEmail").value;

        const urgent =
            document.getElementById("urgentItem").checked;


        const newItem = {

            id: Date.now(),

            title: name,

            category: category,

            description: description,

            location: location,

            emoji: getCategoryEmoji(category),

            expiresAt: deadline,

            urgent: urgent,

            poster: poster,

            email: email

        };


        items.unshift(newItem);


        closePostModal();

        document
            .getElementById("postForm")
            .reset();


        displayItems();

        showToast("🎉 Your item has been posted!");

    });


// --------------------------------------------------
// CATEGORY EMOJIS
// --------------------------------------------------

function getCategoryEmoji(category) {

    const emojis = {

        Books: "📚",

        Furniture: "🪑",

        Electronics: "💻",

        Food: "🍱",

        Other: "🎁"

    };

    return emojis[category] || "🎁";

}


// --------------------------------------------------
// CLAIM MODAL
// --------------------------------------------------

function openClaimModal(itemId) {

    document
        .getElementById("claimItemId")
        .value = itemId;

    document
        .getElementById("claimModal")
        .classList.add("show");

}


function closeClaimModal() {

    document
        .getElementById("claimModal")
        .classList.remove("show");

}


// --------------------------------------------------
// CLAIM ITEM
// --------------------------------------------------

document
    .getElementById("claimForm")
    .addEventListener("submit", function(event) {

        event.preventDefault();


        const itemId =
            document.getElementById("claimItemId").value;


        const item =
            items.find(
                item => item.id == itemId
            );


        if (!item) {

            showToast("This item is no longer available.");

            closeClaimModal();

            return;

        }


        const name =
            document.getElementById("claimName").value;


        closeClaimModal();

        document
            .getElementById("claimForm")
            .reset();


        showToast(
            `🎉 Claim request sent for ${item.title}!`
        );

    });


// --------------------------------------------------
// TOAST
// --------------------------------------------------

function showToast(message) {

    const toast =
        document.getElementById("toast");

    toast.textContent = message;

    toast.classList.add("show");


    setTimeout(() => {

        toast.classList.remove("show");

    }, 3000);

}


// --------------------------------------------------
// SCROLL
// --------------------------------------------------

function scrollToItems() {

    document
        .getElementById("items-section")
        .scrollIntoView({
            behavior: "smooth"
        });

}


// --------------------------------------------------
// CLOSE MODAL WHEN CLICKING OUTSIDE
// --------------------------------------------------

window.addEventListener("click", function(event) {

    const postModal =
        document.getElementById("postModal");

    const claimModal =
        document.getElementById("claimModal");


    if (event.target === postModal) {

        closePostModal();

    }


    if (event.target === claimModal) {

        closeClaimModal();

    }

});


// --------------------------------------------------
// INITIAL LOAD
// --------------------------------------------------

displayItems();