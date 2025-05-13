    let currentDay = null;

    const attendanceData = {
      'May 3': [
        { name: 'Adiarte', status: 'Present' },
        { name: 'Abayan', status: 'Late' },
        { name: 'Fabros', status: 'Absent' },
        { name: 'Caridad', status: 'Late' },
        { name: 'Eja', status: 'Present' },
        { name: 'Escaraman', status: 'Present' },
        { name: 'Amis', status: 'Absent' },
        { name: 'Joreen', status: 'Absent' },
        { name: 'Ruben', status: 'Absent' },
        { name: 'Afliccion', status: 'Present' }
      ],
      'May 4': [
        { name: 'Adiarte', status: 'Present' },
        { name: 'Abayan', status: 'Late' },
        { name: 'Fabros', status: 'Absent' },
        { name: 'Caridad', status: 'Late' },
        { name: 'Eja', status: 'Present' },
        { name: 'Escaraman', status: 'Present' },
        { name: 'Amis', status: 'Absent' },
        { name: 'Joreen', status: 'Absent' },
        { name: 'Ruben', status: 'Absent' },
        { name: 'Afliccion', status: 'Present' }
      ],
      'May 5': [
        { name: 'Adiarte', status: 'Present' },
        { name: 'Abayan', status: 'Late' },
        { name: 'Fabros', status: 'Absent' },
        { name: 'Caridad', status: 'Late' },
        { name: 'Eja', status: 'Present' },
        { name: 'Escaraman', status: 'Present' },
        { name: 'Amis', status: 'Absent' },
        { name: 'Joreen', status: 'Absent' },
        { name: 'Ruben', status: 'Absent' },
        { name: 'Afliccion', status: 'Present' }
      ],
      'May 6': [
        { name: 'Adiarte', status: 'Present' },
        { name: 'Abayan', status: 'Late' },
        { name: 'Fabros', status: 'Absent' },
        { name: 'Caridad', status: 'Late' },
        { name: 'Eja', status: 'Present' },
        { name: 'Escaraman', status: 'Present' },
        { name: 'Amis', status: 'Absent' },
        { name: 'Joreen', status: 'Absent' },
        { name: 'Ruben', status: 'Absent' },
        { name: 'Afliccion', status: 'Present' }
      ],
      'May 7': [
        { name: 'Adiarte', status: 'Present' },
        { name: 'Abayan', status: 'Late' },
        { name: 'Fabros', status: 'Present' },
        { name: 'Caridad', status: 'Late' },
        { name: 'Eja', status: 'Present' },
        { name: 'Escaraman', status: 'Present' },
        { name: 'Amis', status: 'Present' },
        { name: 'Joreen', status: 'Present' },
        { name: 'Ruben', status: 'Present' },
        { name: 'Afliccion', status: 'Present' }
      ],
      'May 8': [
        { name: 'Adiarte', status: 'Late' },
        { name: 'Abayan', status: 'Present' },
        { name: 'Fabros', status: 'Present' },
        { name: 'Caridad', status: 'Present' },
        { name: 'Eja', status: 'Present' },
        { name: 'Escaraman', status: 'Late' },
        { name: 'Amis', status: 'Present' },
        { name: 'Joreen', status: 'Absent' },
        { name: 'Ruben', status: 'Present' },
        { name: 'Afliccion', status: 'Present' }
      ],
      'May 9': [
        { name: 'Adiarte', status: 'Present' },
        { name: 'Abayan', status: 'Present' },
        { name: 'Fabros', status: 'Absent' },
        { name: 'Caridad', status: 'Present' },
        { name: 'Eja', status: 'Present' },
        { name: 'Escaraman', status: 'Present' },
        { name: 'Amis', status: 'Present' },
        { name: 'Joreen', status: 'Present' },
        { name: 'Ruben', status: 'Present' },
        { name: 'Afliccion', status: 'Present' }
      ],
      'May 10': [
        { name: 'Adiarte', status: 'Present' },
        { name: 'Abayan', status: 'Late' },
        { name: 'Fabros', status: 'Present' },
        { name: 'Caridad', status: 'Late' },
        { name: 'Eja', status: 'Present' },
        { name: 'Escaraman', status: 'Present' },
        { name: 'Amis', status: 'Absent' },
        { name: 'Joreen', status: 'Present' },
        { name: 'Ruben', status: 'Present' },
        { name: 'Afliccion', status: 'Absent' }
      ]
    };

    const dates = Object.keys(attendanceData);
    const values = dates.map(date =>
      attendanceData[date].filter(s => s.status !== 'Absent').length
    );

    const ctx = document.getElementById('dailyAttendanceChart').getContext('2d');
    const chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: dates,
        datasets: [{
          label: 'Present Count',
          data: values,
          backgroundColor: '#344154'
        }]
      },
      options: {
        onClick: (e, elements) => {
          if (elements.length > 0) {
            const index = elements[0].index;
            const date = chart.data.labels[index];
            const students = attendanceData[date];

            currentDay = date;

            document.getElementById('selectedDate').textContent = date;
            const list = document.getElementById('studentNames');
            list.innerHTML = '';
            students.forEach(({ name, status }) => {
              const li = document.createElement('li');
              li.textContent = `${name} - ${status}`;
              li.classList.add(status.toLowerCase());
              list.appendChild(li);
            });

            document.getElementById('studentList').style.display = 'block';
          }
        },
        plugins: {
          tooltip: {
            callbacks: {
              label: function (context) {
                return `Present Count: ${context.raw}`;
              }
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            suggestedMax: 20
          }
        }
      }
    });

    function downloadCSV() {
      if (!currentDay || !attendanceData[currentDay]) {
        alert('Please select a date from the chart first.');
        return;
      }

      const rows = [['Date', 'Student Name', 'Status']];
      attendanceData[currentDay].forEach(({ name, status }) => {
        rows.push([currentDay, name, status]);
      });

      const csvContent = rows.map(e => e.join(',')).join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });

      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `attendance-${currentDay}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }