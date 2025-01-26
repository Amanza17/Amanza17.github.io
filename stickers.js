document.getElementById('openStickerBank').addEventListener('click', function() {
    document.getElementById('stickerBank').classList.toggle('hidden');
});

const stickers = document.querySelectorAll('.sticker');
const canvas = document.getElementById('canvas');

// Function to make stickers draggable
function makeStickerDraggable(sticker) {
    sticker.addEventListener('mousedown', function(e) {
        let shiftX = e.clientX - sticker.getBoundingClientRect().left;
        let shiftY = e.clientY - sticker.getBoundingClientRect().top;

        function moveAt(pageX, pageY) {
            sticker.style.left = pageX - shiftX + 'px';
            sticker.style.top = pageY - shiftY + 'px';
        }

        // Move the sticker
        moveAt(e.pageX, e.pageY);

        function onMouseMove(e) {
            moveAt(e.pageX, e.pageY);
        }

        document.addEventListener('mousemove', onMouseMove);

        sticker.onmouseup = function() {
            document.removeEventListener('mousemove', onMouseMove);
            sticker.onmouseup = null;
            saveStickers();
        };
    });

    sticker.ondragstart = function() {
        return false;
    };
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

// Save stickers to the server
function saveStickers() {
    const stickersData = [];
    document.querySelectorAll('.canvas img').forEach(sticker => {
        stickersData.push({
            src: sticker.src,
            left: sticker.style.left,
            top: sticker.style.top
        });
    });
    fetch('/save-stickers', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(stickersData)
    });
}

// Load stickers from the server
function loadStickers() {
    fetch('/load-stickers')
        .then(response => response.json())
        .then(stickersData => {
            stickersData.forEach(data => {
                const img = document.createElement('img');
                img.src = data.src;
                img.classList.add('draggable');
                img.style.left = data.left;
                img.style.top = data.top;
                canvas.appendChild(img);
                makeStickerDraggable(img);
            });
        });
}

// Load stickers on page load
window.addEventListener('load', loadStickers);
