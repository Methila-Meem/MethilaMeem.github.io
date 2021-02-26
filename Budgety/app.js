//BUDGET CONTROLLER
var budgetController = (function(){

    var Expense = function(id, description, value){
        this.id = id;
        this.description = description;
        this.value = value;
        this.percentage = -1;
    };
    
    Expense.prototype.calcPercentage = function(totalIncome){
        
        if(totalIncome > 0){
            
            this.percentage = Math.round((this.value/totalIncome) * 100);
            
        } else{
            
            this.percentage  = -1;
        }
        
    };
    
    Expense.prototype.getPercentage = function(){
        
        return this.percentage;
    };
    
    var Income = function(id, description, value){
        this.id = id;
        this.description = description;
        this.value = value;
    };
    
    var calculateTotal = function(type){
        
        var sum = 0;
        
        data.allItems[type].forEach(function(cur){
            
           sum = sum + cur.value; 
        });  
        
        data.totals[type] = sum;
        
    };
    
    var data = {
        
        allItems:{
            inc: [], 
            exp: [],
        },
        
        totals: {
            inc: 0,
            exp: 0,
        },
        
        budget: 0,
        
        percentage: -1
    };
    
    return {
        
        addItem: function(type, des, val){
            
            var newItem, ID;
            
            //Create new ID 
            if(data.allItems[type].length > 0 ){
                
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;// ID  = last ID + 1
                
               } else{
               
                ID = 0;
               }
            
            //Create new item based on 'inc' or 'exp'
            if(type === 'exp'){
                
                 newItem = new Expense(ID, des, val);
                
            } else if(type === 'inc'){
                
                 newItem = new Income(ID, des, val);
            }
            
            //Push new item into data structure
            data.allItems[type].push(newItem);
            
            //Return the new element
            return newItem;
           
        },
        
         deleteItem: function(type, id){
            
            var ids, index;
            
            //for id = 6
            //data.allItems[type][id]
            //ids = [1,2,4,6,8] here, after deletion remaining items are mapped to preserve previous id
            //after mapping, index = 3
            
            ids = data.allItems[type].map(function(current){
                
                return current.id;
            });
            
            index = ids.indexOf(id);
            
            if( index !== -1){
                
                data.allItems[type].splice(index, 1);   
            }
            
        },
        
        calculateBudget: function(){
            
            //Calculate income & expense
            calculateTotal('exp');
            calculateTotal('inc');
            
            //Calculate the budget: income - expense
            data.budget = data.totals.inc - data.totals.exp;
            
            //Calculate the percentage of income spent
            if(data.totals.inc > 0){
                
                data.percentage = Math.round((data.totals.exp/data.totals.inc)*100);
                
            } else{
                
                data.percentage = -1;
            }
        },
        
        calculatePercentages: function(){
            
            /* example
            a = 20
            b = 30
            c = 40
            income = 100
            a = 20/100 = 20%
            b = 30/100 = 30%
            c = 40/100 = 40%
            */
            data.allItems.exp.forEach(function(cur){
                cur.calcPercentage(data.totals.inc);
            });
        },
        
        getPercentages: function(){
            var allPercent  = data.allItems.exp.map(function(cur){
                
                return cur.getPercentage();
            });
            
            return allPercent;
        },
                
        getBudget: function(){
            return{
                budget: data.budget,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                percentage: data.percentage
            };
        },
        
        testing: function(){
            
            console.log(data);
        }   
    };
    
})(); 
 
//UI CONTROLLER
var UIController = (function(){
    
    var DomString = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn', 
        incomeContainer: '.income__list',
        expensesContainer: '.expenses__list',
        budgetLabel: ".budget__value",
        incomeLabel: ".budget__income--value",
        expensesLabel: ".budget__expenses--value",
        percentageLabel: ".budget__expenses--percentage",
        container: ".container",
        expensePercLable: ".item__percentage",
        dateLabel: ".budget__title--month",
    };
    
    var formatNumber = function(num, type){
            
            var numSplit, int, dec;
            /*
            + or - before number;
            exatcly 2 decimal points;
            comma separating the thousands; 2310.4567 >> + 2,310.46; 2000 >> + 2,000.00
            */
            
            num = Math.abs(num);
            num = num.toFixed(2);
            numSplit = num.split('.');
            int = numSplit[0];
            
            if(int.length > 3){
                
                int = int.substr(0, int.length - 3) + ',' + int.substr(int.length - 3, 3);    
            }
            
            dec = numSplit[1];
            
            return (type === 'exp'? '-' : '+') + ' ' + int + '.' + dec;  
        };
    
    var nodeListForEach = function(list, callback){
                
                for(var i = 0; i < list.length; i++){
                    
                    callback(list[i], i);
                }
            };
          
    return {
        
        getInput: function(){
            
            return{
                
                type: document.querySelector(DomString.inputType).value,//Selects either inc or exp
                description: document.querySelector(DomString.inputDescription).value,
                value: parseFloat(document.querySelector(DomString.inputValue).value),     
            };
        },
        
        addListItem: function(obj, type){
            
            var html, newHtml, element;
            
            //Create HTML string with placeholder text
            if(type === 'inc' ){
                
                element = DomString.incomeContainer;
                html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div</div>'  
                
            } else if(type === 'exp'){
                
                element = DomString.expensesContainer;
                html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
            }
            
            //Replace the placeholder text with actual data
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', formatNumber(obj.value, type));
            
            //Insert the HTML into the DOM
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
        },
        
        deleteListItem: function(selectorID){
             var ele = document.getElementById(selectorID);
             ele.parentNode.removeChild(ele);
        },
         
        clearFields: function(){
            
            var fields, fieldArr;
            
            fields = document.querySelectorAll(DomString.inputDescription + ', ' + DomString.inputValue); 
            
            fieldArr = Array.prototype.slice.call(fields);
            
            fieldArr.forEach(function(current, index, array){
                current.value = "";
            });
            
            fieldArr[0].focus();
        },
        
        displayBudget: function(obj){
            var type;
            obj.budget >=  0 ? type = 'inc' : type = 'exp';
            document.querySelector(DomString.budgetLabel).textContent = formatNumber(obj.budget, type);
            document.querySelector(DomString.incomeLabel).textContent = formatNumber(obj.totalInc, 'inc');
            document.querySelector(DomString.expensesLabel).textContent = formatNumber(obj.totalExp, 'exp');
            
            if(obj.percentage > 0){
                
                document.querySelector(DomString.percentageLabel).textContent = obj.percentage + '%';
                
            } else{
                
                document.querySelector(DomString.percentageLabel).textContent = "---";
            }  
        },
        
        displayPercentages: function(percentages){
            
            var fields = document.querySelectorAll(DomString.expensePercLable);
            
            nodeListForEach(fields, function(current, index){
                
                if(percentages[index] > 0){
                    
                    current.textContent = percentages[index] + '%';
                    
                } else{
                    
                    current.textContent = '---';
                }
                
            });
            
        },
        
        displayMonth: function(){
           
            var now, months, month, year;
            
            now = new Date();
            months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
            month = now.getMonth();
            year = now.getFullYear();
            
            document.querySelector(DomString.dateLabel).textContent = months[month] + ' ' + year;
            
        },
        
        changedType: function(){
            
            var fields = document.querySelectorAll(
                DomString.inputType + ',' +
                DomString.inputDescription + ',' +
                DomString.inputValue);
            
            nodeListForEach(fields, function(cur){
                
                cur.classList.toggle('red-focus');
            });
            
            document.querySelector(DomString.inputBtn).classList.toggle('red');
        },
        
        getDOMstrings: function(){
            
            return DomString;
        }
    };
    
})();


//GLOBAL APP CONTROLLER
var AppController = (function(budgetCtrl, UiCtrl){
    
     var Dom  = UiCtrl.getDOMstrings();
        
     var setUpEventListners = function(){
        
         document.querySelector(Dom.inputBtn).addEventListener('click', ctrlAddItem);
    
         document.addEventListener('keypress', function(event){
            
              if(event.keyCode === 13 || event.which === 13 ){
                
                 ctrlAddItem();   
             }
         });
        
         document.querySelector(Dom.container).addEventListener('click', ctrlDeleteItem);
         
         document.querySelector(Dom.inputType).addEventListener('change', UiCtrl.changedType);
    };
    
    var updateBudget = function(){
        
        //1. Calculate the budget
        budgetCtrl.calculateBudget();
        
        //2. Return the budget
        var budget = budgetCtrl.getBudget();
        
        //3. Display the budget on the UI
        UiCtrl.displayBudget(budget);
    };
    
    var updatePercentages = function(){
        
        //1. Calculate percentages
        budgetCtrl.calculatePercentages();
        
        //2. Read percentages from the budgetcontroller
        var percentage  = budgetCtrl.getPercentages();
        
        //3. Update UI with the new percentages
        UiCtrl.displayPercentages(percentage);
    }; 
    
    var ctrlAddItem = function(){
        
        var input, newItem;

        //1. Get the field input data
        input = UiCtrl.getInput();
        
        if(input.description !== "" && input.value > 0 && !isNaN(input.value) ){
            //2. Add the item to the budget controller
            newItem = budgetCtrl.addItem(input.type, input.description, input.value);
        
            //3. Add the item to UI
            UiCtrl.addListItem(newItem, input.type);
        
            //4. Clear fields
            UiCtrl.clearFields();
        
            //5. Calculate and update the budget
            updateBudget();
            
            //6. Calculate and update the percentages
            updatePercentages();
        } 
        
    };
    
    var ctrlDeleteItem = function(event) {
        
        var itemID, splitID, type, ID;
        
        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;
        
        if (itemID) {
            
            //inc-1
            splitID = itemID.split('-');
            type = splitID[0];
            ID = parseInt(splitID[1]);
            
            // 1. delete the item from the data structure
            budgetCtrl.deleteItem(type, ID);
            
            // 2. Delete the item from the UI
            UiCtrl.deleteListItem(itemID);
            
            // 3. Update and show the new budget
            updateBudget();

            //4. Calculate and update the percentages
            updatePercentages();
            
        }
    };
    
    return {
        
        init: function(){
            
            console.log("Application has started....");
            UiCtrl.displayMonth();
            UiCtrl.displayBudget(
                {
                    budget: 0,
                    totalInc: 0,
                    totalExp: 0,
                    percentage: -1
                });
            setUpEventListners();
        }
    };
       
})(budgetController, UIController);

AppController.init();