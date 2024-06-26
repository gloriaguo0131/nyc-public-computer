let data;
let colorDict = {'Open':'#81C784', 'Temporarily closed':'#B3E5FC', 'Not Operating': '#CFD8DC', 'Temporarily Closed': '#FFEBEE', 'Not operating':'#EDE7F6'}

let currentIndex = 0;
  const updateForm = () => {
    const currentData = data[currentIndex];
    console.log(currentData['location_name'])
    for (const key in currentData) {
      if (currentData.hasOwnProperty(key)) {
        document.getElementById(key).innerText = currentData[key];
      }
      
    let oid = document.getElementById("oid");
    oid.innerHTML = currentData['location_name']
    }
  };
  const formContainer = document.querySelector('.form-container');
  const xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function() {
    if (xhr.readyState === XMLHttpRequest.DONE) {
      if (xhr.status === 200) {
        const urlParams = new URLSearchParams(window.location.search);
        const parameter = urlParams.get('vid');
        data = JSON.parse(xhr.responseText);
        for (let key in data[parameter]) {
            if (data[parameter].hasOwnProperty(key) && key != "oid") {
              let formGroup = document.createElement('div');
              formGroup.className = 'form-group';
        
              let label = document.createElement('label');
              if (key == "technology_related_courses"){
                formGroup.classList.add("doubleWidth")
              }
              label.setAttribute('for', key);
              label.textContent = key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, ' ') + ":";
        
              let paragraph = document.createElement('p');
              paragraph.id = key;
              paragraph.textContent = data[parameter][key];
        
              formGroup.appendChild(label);
              formGroup.appendChild(paragraph);
        
              formContainer.appendChild(formGroup);
            }
        }
        console.log(data[parameter])
        document.body.style.backgroundColor = colorDict[data[parameter]['operating_status']] + '99'
        for(let i in data){
          if(data[i]['oid'] == parameter) currentIndex = i
        }
        updateForm();
      } else {
        console.error('Failed to load JSON file.');
      }
    }
  };
  xhr.open('GET', 'sejx-2gn3.json', true);
  xhr.send();

  const beforeBtn = document.getElementById('beforeBtn');
  const nextBtn = document.getElementById('nextBtn');

  beforeBtn.addEventListener('click', () => {
    if (currentIndex > 0) {
      currentIndex--;
      updateForm();
    }
  });

  nextBtn.addEventListener('click', () => {
    if (currentIndex < data.length - 1) {
      currentIndex++;
      updateForm();
    }
  });