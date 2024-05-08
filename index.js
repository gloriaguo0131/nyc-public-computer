const myFilter = ['address_suffix', 'city', 'oversight_agency','operating_status']

document.addEventListener("DOMContentLoaded", function() {
    const filterOptions = document.getElementById('filter-options');
    const dataDisplay = document.getElementById('data-display');
    
    fetch('sejx-2gn3.json')
      .then(response => response.json())
      .then(jsonData => {
        data = jsonData;
        renderFilterOptions(data);
        renderData(data);
      })
      .catch(error => console.error('Error loading JSON:', error));
    
    function renderFilterOptions(data) {
      const filters = {};
  
      data.forEach(entry => {
        Object.keys(entry).forEach(key => {
          if (!filters[key]) {
            filters[key] = new Set();
          }
          filters[key].add(entry[key]);
        });
      });
  
      Object.keys(filters).forEach(key => {
        if(myFilter.includes(key)){
            const checkboxGroup = document.createElement('div');
            checkboxGroup.classList.add('checkbox-group');
            const label = document.createElement('label');
            label.classList.add('filterTitle')
            label.textContent = key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, ' ') + ':';
            checkboxGroup.appendChild(label);
            filters[key].forEach(value => {
                if(value != 'Temporarily Closed' && value != 'Not operating'){
                  if(value == 'Temporarily closed'){
                    value = 'Temporarily Closed'
                  }
                  const choose = document.createElement('div');
                  choose.classList.add('choose')
                  const checkbox = document.createElement('input');
                  checkbox.type = 'checkbox';
                  checkbox.value = value;
                  checkbox.addEventListener('change', applyFilters);
                  const checkboxLabel = document.createElement('label');
                  checkboxLabel.textContent = value;
                  choose.appendChild(checkbox);
                  choose.appendChild(checkboxLabel);
                  checkboxGroup.append(choose)
                }

            });
            filterOptions.appendChild(checkboxGroup);
        }
      });
    }
  
    function renderData(data) {
        const totalNumber = document.getElementById('totalNumber')
        totalNumber.innerHTML = "Total Number: " + data.length
      dataDisplay.innerHTML = '';
      data.forEach(entry => {
        const row = document.createElement('div');
        row.classList.add('data-row');
        if(entry['operating_status'] == 'Open'){
            row.style.backgroundColor = '#81C784'
        }else if(entry['operating_status'] == 'Temporarily closed'){
            row.style.backgroundColor = '#B3E5FC'
        }else if(entry['operating_status'] == 'Not Operating'){
            row.style.backgroundColor = '#CFD8DC'
        }else if(entry['operating_status'] == 'Temporarily Closed'){
            row.style.backgroundColor = '#FFEBEE'
        }else{
            row.style.backgroundColor = '#EDE7F6'
        }
        row.textContent = entry.location_name;
        row.addEventListener('mouseenter', () => {
            showTooltip(entry, row);
        });
        row.addEventListener('mouseleave', () => {
            hideTooltip();
        });
        row.addEventListener('click', () => {
            redirectToPage(entry['oid'])
        });
        
        dataDisplay.appendChild(row);
      });
    }
  
    // Apply filters
    function applyFilters() {
      const filters = {};
      document.querySelectorAll('input[type="checkbox"]:checked').forEach(checkbox => {
        const key = reverseTransformation(checkbox.parentNode.parentNode.firstElementChild.textContent)
        const value = checkbox.value;
        if (!filters[key]) {
          filters[key] = new Set();
        }
        filters[key].add(value);
      });
  
      const filteredData = data.filter(entry => {
        return Object.keys(filters).every(key => {
          return filters[key].has(entry[key]);
        });
      });
  
      renderData(filteredData);
    }
  });
  

  function reverseTransformation(str) {
    const lowerCaseStr = str.charAt(0).toLowerCase() + str.slice(1);
    const underscoreStr = lowerCaseStr.replace(/[A-Z]/g, match => '_' + match.toLowerCase());
    const originalStr = underscoreStr.replace(/:/g, '').replace(/ /g, '_');
    return originalStr;
}


function showTooltip(data, element) {
    const tooltip = document.createElement('div');
    tooltip.classList.add('tooltip');
    const info1 = document.createElement('div')
    info1.textContent = `Location: ${data.location_name}`;
    tooltip.appendChild(info1)
    const info2 = document.createElement('div')
    info2.textContent = `OverSight agency: ${data.overSight_agency}`;
    tooltip.appendChild(info2)
    const info3 = document.createElement('div')
    info3.textContent = `Operating status: ${data.operating_status}`;
    tooltip.appendChild(info3)
    const info4 = document.createElement('div')
    info4.textContent = `Address suffix: ${data.address_suffix}`;
    tooltip.appendChild(info4)
    const info5 = document.createElement('div')
    info5.textContent = `Address suffix: ${data.address_suffix}`;
    tooltip.appendChild(info5)
    document.body.appendChild(tooltip);
    const rect = element.getBoundingClientRect();
    const tooltipHeight = tooltip.offsetHeight;
    tooltip.style.top = rect.top - tooltipHeight - 10 + 'px';
    tooltip.style.left = rect.left + 'px';
    console.log(element.style.backgroundColor)
    tooltip.style.backgroundColor = element.style.backgroundColor.replace('rgb', 'rgba').replace(')', ', 0.8)');

}

function hideTooltip() {
    const tooltip = document.querySelector('.tooltip');
    if (tooltip) {
        tooltip.remove();
    }
}

function redirectToPage(parameter) {
    var url = './detail' + '?vid=' + parameter;
    window.location.href = url;
}