function timeSince(timeStamp:Date) {
    var now = new Date(),
        secondsPast = (now.getTime() - timeStamp.getTime() ) / 1000;
    if(secondsPast < 60){
        return Math.trunc(secondsPast) + 's';
    }
    if(secondsPast < 3600){
        return Math.trunc(secondsPast/60) + 'min';
    }
    if(secondsPast <= 86400){
        return Math.trunc(secondsPast/3600) + 'h';
    }
    if(secondsPast <= 2628000){
        return Math.trunc(secondsPast/86400) + 'd';
    }
    if(secondsPast <= 31536000){
        return Math.trunc(secondsPast/2628000) + 'mo';
    }
    if(secondsPast > 31536000){
        return Math.trunc(secondsPast/31536000) + 'y';
    }
}

export default timeSince;