document.getElementById('openStickerBank').addEventListener('click', function() {
    document.getElementById('stickerBank').classList.toggle('hidden');
});

const stickers = document.querySelectorAll('.sticker');
const canvas = document.getElementById('canvas');

// Function to make stickers draggable
function makeStickerDraggable(sticker) {
    

    // Make sticker disappear on click
    sticker.addEventListener('click', function() {
        sticker.remove();
        saveStickers();
    });
}

// Add stickers to the canvas
canvas.addEventListener('click', function(e) {
    const stickerSrc = document.querySelector('.sticker.selected')?.dataset.sticker;
    if (stickerSrc) {
        const img = document.createElement('img');
        img.src = stickerSrc;
        img.classList.add('draggable');
        img.style.left = `${e.offsetX - 50}px`;  // Centered at the click point
        img.style.top = `${e.offsetY - 50}px`;
        canvas.appendChild(img);
        makeStickerDraggable(img);
        saveStickers();
    }
});

// Make a sticker selectable
stickers.forEach(sticker => {
    sticker.addEventListener('click', function() {
        stickers.forEach(st => st.classList.remove('selected'));
        sticker.classList.add('selected');
    });
});

// Save stickers to localStorage
function saveStickers() {
    const stickersData = [];
    document.querySelectorAll('.canvas img').forEach(sticker => {
        stickersData.push({
            src: sticker.src,
            left: sticker.style.left,
            top: sticker.style.top
        });
    });
    localStorage.setItem('stickers', JSON.stringify(stickersData));
}

// Load stickers from localStorage
function loadStickers() {
    const stickersData = JSON.parse(localStorage.getItem('stickers'));
    if (stickersData) {
        stickersData.forEach(data => {
            const img = document.createElement('img');
            img.src = data.src;
            img.classList.add('draggable');
            img.style.left = data.left;
            img.style.top = data.top;
            canvas.appendChild(img);
            makeStickerDraggable(img);
        });
    }
}

// Load stickers on page load
window.addEventListener('load', loadStickers);
