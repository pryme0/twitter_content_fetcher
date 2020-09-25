window.onload = () => {
    let windowLocation = window.location.pathname;
    //defining logic for index page
    // if (windowLocation == '/') {
    //     if (navigator.geolocation) {
    //         navigator.geolocation.getCurrentPosition(function(position) {

    //             var lat = position.coords.latitude;
    //             var lng = position.coords.longitude;
    //             console.log(lng)
    //                 //..

    //         });
    //     }
    // }
    if (windowLocation == '/dashboard') {
        let mainEle = document.getElementById('main')


        let getContent = async function() {
            try {
                fetch('/getuserContent')
                    .then((res) => res.json())
                    .then(data => {
                        var userData = data.statuses
                        console.log(userData)
                        var main = document.getElementById('main')
                        main.innerHTML = ''
                        userData.forEach((dat) => {
                            let well = document.createElement('div')
                            let media_body = document.createElement('div')
                            let mainCont = document.createElement('div')
                            let container = document.createElement('div')
                            let media = document.createElement('div')
                            let pull_left = document.createElement('a')
                            let img = document.createElement('img')
                            let span1 = document.createElement('span')
                            let span2 = document.createElement('span')
                            let p1 = document.createElement('p')
                            let p2 = document.createElement('p')
                            let i = document.createElement('i')
                            let ul = document.createElement('ul')
                            let hr = document.createElement('hr')
                                //set classes for html elements
                            well.className = "well"
                            well.style.backgroundColor = "skyblue"
                            well.style.borderRadius = "8px"
                            well.style.padding = "10px"
                            media_body.className = "media_body"
                            container.className = "container main"
                            pull_left.className = "pull_left"
                            ul.className = "row"
                            img.className = "img-responsive"
                            i.className = "fas fa-thumbs-up"
                            hr.style.height = "5px"

                            //give the html elements values
                            pull_left.href = "#"
                            img.width = "80px"
                            img.height = "80px"
                            img.style.borderRadius = '50px'
                            img.style.width = '80px'
                            img.style.height = '80px'
                            img.src = dat.user.profile_image_url
                            p1.innerHTML = `By  ${dat.user.name}`
                            p2.innerHTML = dat.text
                            span1.innerHTML = dat.favorite_count

                            //building the html
                            span1.appendChild(i)
                            ul.appendChild(span1)
                            media_body.appendChild(p1)
                            media_body.appendChild(p2)
                            media_body.appendChild(ul)
                            pull_left.appendChild(img)
                            media.appendChild(pull_left)
                            media.appendChild(media_body)
                            well.appendChild(media)
                            container.appendChild(well)
                            container.appendChild(hr)
                            main.appendChild(container)
                        })


                    })
            } catch (err) {
                console.log(err)
            }
        }

        let upPref = function(e) {
            e.preventDefault()
            let stringPref = document.forms['interestForm']['inputInterests'].value
            let preffArray = stringPref.split(',')
            var data = JSON.stringify(preffArray);
            console.log(data)
            fetch('/updateinterest', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: data
                }).then((resp) => resp.json())
                .then(data => {

                })

        }

        getContent()
        let clickPreffUpdate = document.getElementById('submitInterest').addEventListener('click', upPref)
    }

}