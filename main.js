document.addEventListener('DOMContentLoaded', function (){

  let formAddStudent = document.querySelector('.add-student');
  let inputAddStudent = document.querySelectorAll('.add-student-form');
  let studentTable = document.querySelector('.student-table');
  let inputDate = document.querySelector('.input-date');
  let currentDate = new Date();
  let dd = String(currentDate.getDate()).padStart(2, '0');
  let mm = String(currentDate.getMonth() + 1).padStart(2, '0');
  let yyyy = currentDate.getFullYear();
  let titleTable = document.querySelectorAll('.td-title');
  let resetBtn = document.querySelector('.reset-btn');

  let validation = new JustValidate('.add-student');

  validation
    .addField('#name',[
      {
        rule: 'minLength',
        value: 2,
        errorMessage: 'Имя должно содержать не менее 2 символов',
      },
      {
        rule: 'maxLength',
        value: 20,
        errorMessage: 'Имя должно содержать не более 20 символов',
      },
      {
        rule: 'required',
        errorMessage: 'Введите имя',
      }
    ])
    .addField('#surname', [
        {
          rule: 'minLength',
          value: 2,
          errorMessage: 'Фамилия должна содержать не менее 2 символов',
        },
        {
          rule: 'maxLength',
          value: 20,
          errorMessage: 'Фамилия должна содержать не более 20 символов',
        },
        {
          rule: 'required',
          errorMessage: 'Введите фамилию',
        }
    ])

    .addField('#middlename', [
      {
        rule: 'minLength',
        value: 2,
        errorMessage: 'Отчество должно содержать не менее 2 символов',
      },
      {
        rule: 'maxLength',
        value: 20,
        errorMessage: 'Отчество должно содержать не более 20 символов',
      },
      {
        rule: 'required',
        errorMessage: 'Введите отчество',
      }
    ])

    .addField('#birth', [
      {
        rule: 'required',
        errorMessage: 'Введите дату рождения',
      },
    ])

    .addField('#start-date', [
      {
        rule: 'required',
       errorMessage: 'Введите дату поступления',
      },
      {
        rule: 'minNumber',
        value: 2000,
        errorMessage: 'Год должен быть не меньше 2000',
      },
      {
        rule: 'maxNumber',
        value: yyyy,
        errorMessage: 'Год должен быть не больше текущего',
      }
    ])

    .addField('#faculty', [
      {
        rule: 'minLength',
        value: 2,
        errorMessage: 'Название факультета должно содержать не менее 2 символов',
      },
      {
        rule: 'maxLength',
        value: 20,
        errorMessage: 'Название факультета должно содержать не более 20 символов',
      },
        {
          rule: 'required',
          errorMessage: 'Введите название факультета',
        }
      ]);

  currentDate = yyyy + '-' + mm + '-' + dd;

  inputDate.setAttribute('max', currentDate);

  let arrStudentInTable = [];

  formAddStudent.addEventListener('submit', function (e){
      let arrStudent = [];

    inputAddStudent.forEach(item => {
      arrStudent.push((item.value).trim());
      item.value = '';
    });

    if (!Boolean(document.querySelector('.just-validate-error-label'))){
      arrStudentInTable.push(add_students_to_obj(arrStudent));

      fillTable(arrStudentInTable);
    }

    inputAddStudent.forEach(item => item.value.innerHTML = '');
  });

  inputAddStudent.forEach ((item, index) => item.addEventListener('keydown', function (e){
    if (index <= 2 && e.key.match(/[0-9=()<>.,&/?!@]/))return e.preventDefault();
  }))

  resetBtn.addEventListener('click', function (){

    if (arrStudentInTable != 0) {
      clearTable();
      sortTable(arrStudentInTable);
    }

    filterInput.forEach(item => item.value = "");
  })

  function add_students_to_obj (dataArr) {
    let objStudents = {};
    let newArr = dataArr.slice();

    let ddB = dataArr[3].substr(8, 2);
    let mmB = dataArr[3].substr(5, 2);
    let yyyyB = dataArr[3].substr(0, 4);

    objStudents.fullName = shuffle(newArr.splice(0, 3)).join(' ');
    objStudents.faculty = (newArr.splice(-1, 1)).join(' ');
    let dateBirth = ddB + '.' + mmB + '.' + yyyyB + ' (' + calculate_age(currentDate, (newArr.slice(0, 1)).join(' ')) +')';
    objStudents.birt = dateBirth;

    window.currentDate = currentDate;

    let yearEnd = parseInt(newArr[1]) + 4;

    let curs = yyyy - newArr[1] + ' курс' + ')';

    if (yyyy - newArr[1] == 4 && mm >= '09' || yyyy - newArr[1] > 4) {
      curs = 'закончил)';
    } else if (yyyy - newArr[1] == 0) {
      curs = '1 курс)';
    }

    objStudents.startYear = newArr[1] + '-' + yearEnd + ' (' + curs;
    return objStudents;
  }

  function shuffle (arr) {
    let i = arr[0];
    arr[0] = arr[1];
    arr[1] = i;

    return arr;
  }

  function calculate_age (currentDate, dateBirth) {
    let age = currentDate.substr(0, 4) - dateBirth.substr(0, 4);

    if ((currentDate.substr(5, 2) == dateBirth.substr(5, 2) && currentDate.substr(8, 2) >= dateBirth.substr(8, 2)) || currentDate) {
      return age;
    } else return (age - 1);
  }

  function fillTable (arr) {
    let row = document.createElement('tr');
    row.classList.add('row-student');

    for(let i = 0; i < 4; i++) {

      let counter = 0;
      let td = document.createElement('td');

      for (key in arr[0]) {
        if (i == counter){
          td.innerHTML = arr[arr.length - 1][key];
        }

        counter++;
      }
      row.append(td);
    }
    studentTable.append(row);

  }

  function sortTable (arr) {

    for (let i = 0; i < arr.length; i++) {
      let row = document.createElement('tr');
      row.classList.add('row-student');

      let counter = 0;

      while (counter < 4) {
        let td = document.createElement('td');
        let count = 0;

        for (key in arr[i]) {
          if (counter == count){
            td.innerHTML = arr[i][key];
          }
          count++;

          row.append(td)
        }
        counter++;
      }
      studentTable.append(row);
    }
  }

  function clearTable () {
    let row_student = document.querySelectorAll('.row-student');

    row_student.forEach(item => {
      item.innerHTML = ' ';
    })
  }

  function sortStudent (list, index) {
      if (index == 0) {
        list.sort((a, b) => a.fullName > b.fullName ? 1 : -1);
      } else if (index == 1) {
        list.sort((a, b) => a.faculty > b.faculty ? 1 : -1);
        } else if (index == 2) {
          list.sort((a, b) => {
            if (a.birt.substr(6) > b.birt.substr(6)){
              return 1;
            } else if (a.birt.substr(6) == b.birt.substr(6) && a.birt.substr(3, 2) > b.birt.substr(3, 2)){
                return 1;
              } else if (a.birt.substr(6) == b.birt.substr(6) && a.birt.substr(3, 2) == b.birt.substr(3, 2) && a.birt.substr(0, 2) > b.birt.substr(0, 2)){
                  return 1;
                  } else return -1;
          });
          } else {
            list.sort((a, b) => a.startYear > b.startYear ? 1 : -1);
      }

      sortTable(list);
      // console.log(list);

      return list;
  }

  let filterForm = document.querySelector('.filter-form');
  let filterInput = document.querySelectorAll('.filter-input');

  filterForm.addEventListener('input', function (e){
    let objFilterStudent = {};
    let arr = [];

    filterInput.forEach((item, index) => {
      arr.push(item.value);
      item.value.trim();
      if (index == 0){
        objFilterStudent.fullName = (item.value).trim();
      } else if (index == 1) {
        objFilterStudent.faculty = (item.value).trim();
      } else if (index == 2) {
        objFilterStudent.startEducation = (item.value).trim();
      } else {
        objFilterStudent.endEducation = (item.value).trim();
      }
    })
    clearTable();
    filtrStudent(arrStudentInTable, objFilterStudent);
  })

  function filtrStudent (arr, obj) {
    let newArr = [];
    let filterArr = [];

    arr.forEach(item => {
      if((item.fullName.includes(obj.fullName) && obj.fullName != '') ||
      (item.faculty.includes(obj.faculty) && obj.faculty != '') ||
      ((item.startYear).substr(0, 4) == obj.startEducation && obj.startEducation != '') ||
      ((item.startYear).substr(5, 4) == obj.endEducation && obj.endEducation != ''))
      {
        newArr.push(item);
      }
    })

    // if
    filterInput.forEach(item => {
      if (item.value != 0){
        filterArr.push(item);
      }
    })


    // clearTable();
    sortTable(newArr);
    if (newArr.length == 0 && filterArr.length == 0){
      sortStudent(arrStudentInTable);
      console.log('тут');
      console.log(arrStudentInTable);
    }
    return newArr;
  }

  titleTable.forEach((item, index) => {
    item.addEventListener('click', function(){
      clearTable();
      sortStudent(arrStudentInTable, index);
    })
  })

})


