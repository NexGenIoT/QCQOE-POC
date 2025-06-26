import moment from 'moment'

export const assetOverviewGraph = {
    DAILY: "DAILY",
    WEEKLY: "WEEKLY",
    MONTHLY: "MONTHLY",
    MONTHLY_3: "MONTHLY_3",
    ALL: "ALL"
}

export const issueTypeOverviewGraph = {
    URL_GENERATION: "UrlGenerationFailed",
    RECHABILITY: "Rechability",
    PLAYBILITY: "Playability",
    INTEGRITY_ISSUE: "Integrity"
}

export const adminMessage = {
    message: "You have no Read/Write permission !! please contact to admin"
}

export const convertDateTime = (date) => {
    let dateToShow = new Date(date).getDate()
    let month = new Date(date).toLocaleString('default', { month: 'short' })
    let year = new Date(date).getFullYear()
    let time = moment(date).format("HH:mm")
    return `${dateToShow} ${month} ${year} | ${time}`
}

export const fixedSelectedContent = {
    epicOn: 'EPICON'
}

export const formatTime = (time) => {
    let time_array = []
    time?.map(t => {
        return time_array.push(moment(t).format('DD-MM-YYYY'))
    })
    return time_array
}

//for qc
export const isValidPermission = (SUB_TYPE) => {
    let userDetails = localStorage.getItem("userDetails") ? JSON.parse(localStorage.getItem("userDetails")) : {};
    // availableRoles = Object.keys(userDetails).length > 0 ? userDetails.roles : [];
    let availablePermissions = Object.keys(userDetails).length > 0 ? userDetails.permissions : [];

    if (availablePermissions.length > 0 && availablePermissions.find(o => o.permissionCode.trim() === SUB_TYPE)) {
        return true;
    }
    return true;
}

export const isValidRole = (SUB_TYPE) => {

    let userDetails = localStorage.getItem("userDetails") ? JSON.parse(localStorage.getItem("userDetails")) : {};
    let availableRoles = Object.keys(userDetails).length > 0 ? userDetails.roles : [];
    let availablePermissions = Object.keys(userDetails).length > 0 ? userDetails.permissions : [];

    if ((availableRoles && availableRoles.find(o => o.roleCode === SUB_TYPE)) || availablePermissions && availablePermissions.find(o => o.permissionCode.trim() === SUB_TYPE)) {
        return true;
    }
    return true;

}

export const getReadAndWrite = (text) => {
    const myArray = text.split(" ")[0];
    return myArray.toUpperCase()
}
export const removeDuplicates = (arr) => {
    return arr.filter((item, index) => arr.indexOf(item) === index);
}

export const removeHour = (arr = [], interval, type) => {
    if (arr.length > 0) {
        return arr?.map((item) => {
            if (interval == "1d" || interval == "1w" || interval == "1m" || interval == "1y") {
                // let abcd = item.slice(0, 8)
                // console.log("item removeHour", moment(new Date(abcd)).format('DD-MM-YY'));
                if (type == "miti") {
                    // if(interval == "1d" || interval == "1w" || interval == "1m" || interval == "1y"){
                        return moment(new Date(item)).format('DD-MM-YY');

                    // }else{
                    //     return moment(new Date(item.replace('T', ' ').replace('Z', ''))).format('DD-MM-YY HH:mm');
                    // }
                } else {
                    return moment(new Date(item)).format('DD-MM-YY')
                }

            }else{
                if (type == "miti") {
                        return moment(new Date(item.replace('T', ' ').replace('Z', ''))).format('DD-MM-YY HH:mm');                  
                }else{
                    return moment(new Date(item)).format('DD-MM-YY HH:mm');   
                }
            }
        });
    }

}

export const convertMilliToDate =(milisecond)=>{
    //toDate=2023-06-07&fromDate=2023-05-07
    return moment(milisecond*1000).format('YYYY-MM-DD')
}