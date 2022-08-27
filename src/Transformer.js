const { Collector } = require("./Collector");
const { DateHelper } = require("./DateHelper");


class Transformer extends DateHelper{
    list = [];
    weeksCounted = [];
    fiveDaysInWeek = null;
    collector;

    constructor(){
        super();
        this.collector = new Collector();
    }

    toWeeks(data=[]){
        let index = 0;
        let listTemp = [];
        for(let d of data){
            if (this.toFiveDays(index)){
                if (!d.week || !d.month || !d.date || !d.year){
                    listTemp.push('');
                }else{
                    listTemp.push(`${this.week(d.week)}, ${this.month(d.month)} ${d.date}, ${d.year}`);
                }
                listTemp.push('');
            }
            index ++;
            if (index === 7){
                index = 0;
                this.weeksCounted.push(d.weekCount);
                this.list.push(listTemp);
                listTemp = [];
            }
        }
        if (listTemp.length){
            if (this.fiveDaysInWeek){
                let count = ((10 - listTemp.length) /2);
                [...Array(count).keys()].forEach(()=>{
                    listTemp.push('');
                    listTemp.push('');
                });
            }
            this.list.push(listTemp);
        }
    }

    useWorkDays(){
        this.fiveDaysInWeek = true;
    }

    toFiveDays(index){
        //this assumes is 7 days full
        if (!this.fiveDaysInWeek){
            return true;
        }
        //days in week start from 0-7.
        //only the day in array will bed allow 
        //the other will be skipped.
        if ([1,2,3,4,5].includes(parseInt(index))){
            return true;
        }
        return false;
    }

    blankCopy(title=''){
        let Week1 = this.list[0];
        let Week2 = this.list[1];
        let Week3 = this.list[2];
        let Week4 = this.list[3];
        let Week5 = this.list[4];
        if (!Week5){
            Week5 = ['','','','','','','','','',''];
        }
        return [
            [title],
            ['','','','','','','','','','','Total hours Weekly'],
            [...Week1, `Week ${this.weeksCounted[0]}`],
            ['','','','','','','','','','','Start and End Time'],
            ['','','','','','', '', '', '', '', '0:00 Hours'],
            [],
            [...Week2, `Week ${this.weeksCounted[1]}`],
            ['','','','','','','','','','','Start and End Time'],
            ['','','','','','','','','','','0:00 Hours'],
            [],
            [...Week3, `Week ${this.weeksCounted[2]}`],
            ['','','','','','','','','','','Start and End Time'],
            ['','','','','','','','','','','0:00 Hours'],
            [],
            [...Week4, `Week ${this.weeksCounted[3]}`],
            ['','','','','','','','','','','Start and End Time'],
            ['','','','','','','','','','','0:00 Hours'],
            [],
            [...Week5, `Week ${this.weeksCounted[4] || ''}`],
            ['','','','','','','','','','','Start and End Time'],
            [ '', '', '', '', '', '', '', '', '-', '', '0:00 Hours' ],
            ['','','','','','','','','','Total hours Monthly','0:00 Hours']
        ]
    }

    newWeekDayCopy(range){
        const data = this.calendarRange(
            range.from.month, 
            range.from.year,
            range.to.month,
            range.to.year
        );

        this.collector.clear();

        for(let date of data){
            this.useWorkDays();
            this.toWeeks(date.calendar);
            this.collector.add(this.blankCopy(date.title));
        }

        return this.collector;
    }
}

module.exports = new Transformer();
