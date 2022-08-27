

class DateHelper{
    month(index=null){
        const m = [
            'January',
            'February',
            'March',
            'April',
            'May',
            'June',
            'July',
            'August',
            'September',
            'October',
            'November',
            'December'
        ];
        if (index == null) return m;
        return m[index] || null;
    }

    week(index){
        const w = [
            'Sunday',
            'Monday',
            'Tuesday',
            'Wednesday',
            'Thursday',
            'Friday',
            'Saturday'
        ];
        if (index == null) return w;
        return w[index] || null;
    }

    weekCount(date){
        const currentdate = new Date(date);
        const oneJan = new Date(currentdate.getFullYear(),0,1);
        const numberOfDays = Math.floor((currentdate - oneJan) / (24 * 60 * 60 * 1000));
        return Math.ceil(( currentdate.getDay() + 1 + numberOfDays) / 7);
    }

    calendar(month, year){
        var caldar = [];
        var date = new Date(year, month, 1);

        [...Array(date.getDay()).keys()].forEach(()=>{
            caldar.push({
                week: '',
                month: '',
                date: '',
                year: '',
            });
        });

        while (date.getMonth() === month) {
            caldar.push({
                week: date.getDay(),
                month: date.getMonth(),
                date: date.getDate(),
                year: date.getFullYear(),
                weekCount: this.weekCount(date)
            });
            date.setDate(date.getDate() + 1);
        }
        
        return {
            //dete tate in the middle of month incase month do not start
            //in beggining of week else will be and empty string and may throw error.
            title: `${this.month(caldar[15].month)} ${caldar[15].year}`,
            calendar: caldar
        }
    }

    calendarRange(fromMonth, fromYear, toMonth, toYear){
        var caldars = [];
        var date = new Date(fromYear, fromMonth, 1);
        var date2 = new Date(toYear, toMonth, 1);

        while (date.getMonth() <= date2.getMonth()) {
            caldars.push(this.calendar(date.getMonth(), date.getFullYear()));
            date.setMonth(date.getMonth() + 1);
        }

        return caldars;
    }
}

module.exports = {
    DateHelper
}
