window.onload = function() {
    let bucketListDiv = document.getElementById("bucketList");
    for(let i = 0; i < bucketList.length; i++) {
        let itemDiv = document.createElement("div");
        itemDiv.className = "bucketItem";
        let status = bucketList[i].status;
        let image = bucketList[i].image;
        let hasMetadata = false;
        let emoji = "";

        // Handling statuses and properties here
        switch(status) {
            case 0:
                itemDiv.className += " notDone";
                emoji = "❌";
                break;
            case 1:
                itemDiv.className += " inProgress";
                emoji = "⏳";

		        let progress = bucketList[i].progress;
                let goal = bucketList[i].goal;
		        let pct = bucketList[i].pct;
                let start = bucketList[i].start;
                let end = bucketList[i].end;
                let done = bucketList[i].done;
            
                var percentage = 0;

                if (typeof progress === 'number' && typeof goal === 'number' && progress >= 0 && goal > 0) {
                   percentage = Math.floor((progress / goal) * 100);
                }

		        if (typeof pct === 'number' && pct > 0) {
                   percentage = pct;
                }

                if (typeof start === 'string' && typeof end === 'string') {
                    percentage = calculatePercentageAdvancement(start, end);
                }

                if (typeof done === 'string') {
                    let doneDate = new Date(done);
                    let today = new Date();
                    today.setHours(0, 0, 0, 0);

                    if (doneDate.getTime() <= today.getTime()) {
                        percentage = 100;
                    }
                }

                if(percentage == 100){
                    itemDiv.className += " done";
                    emoji = "✅";
                    break;
                }

                itemDiv.setAttribute("data-progress", percentage);
		        itemDiv.style.background = `linear-gradient(to right,
                                        #eddf61 0%,
                                        #eddf61 ${percentage}%,
                                        #ffffcc ${percentage}%,
                                        #ffffcc 100%)`;

                break;
            case 2:
                itemDiv.className += " done";
                emoji = "✅";
                break;
        }
        // End status and properties handler

	    if(!config.showStatusEmoji) emoji = "";

        itemDiv.innerText = bucketList[i].item + " " + emoji;
        bucketListDiv.appendChild(itemDiv);

        if(hasMetadata){
            itemDev.addEventListener('click', function() {
                this.classList.toggle('open');
                this.classList.toggle('closed');
            });
        }
    }
}

function calculatePercentageAdvancement(date1, date2) {
    // Parse the dates
    let d1 = new Date(date1);
    let d2 = new Date(date2);
    let now = new Date();

    // Make sure the dates are in the correct order
    if (d1 > d2) {
        let temp = d1;
        d1 = d2;
        d2 = temp;
    }

    // If current date is past the end date, return 100
    if (now > d2) {
        return 100;
    }

    // If current date is before the start date, return 0
    if (now < d1) {
        console.log("Current date is not within the provided range");
        return 0;
    }

    // Calculate the total range and the advancement
    let total = d2.getTime() - d1.getTime();
    let advancement = now.getTime() - d1.getTime();

    // Calculate the percentage
    let percentage = Math.floor((advancement / total) * 100);

    return percentage;
}

function imageExists(url, callback) {
    var img = new Image();
    img.onload = function() { callback(true); };
    img.onerror = function() { callback(false); };
    img.src = url;
}

async function getShortHash(input) {
    const msgUint8 = new TextEncoder().encode(input);                                    
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);                   
    const hashArray = Array.from(new Uint8Array(hashBuffer));                             
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');         
    return hashHex.slice(0, 8);
}
