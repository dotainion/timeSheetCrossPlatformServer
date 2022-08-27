
class Collector{
    collect = [];

    add(item){
        this.collect.push(item);
    }
    
    list(){
        return this.collect;
    }
    
    first(){
        return this.collect?.[0];
    }

    clear(){
        return this.collect = [];
    }
}

module.exports = {
    Collector
}
