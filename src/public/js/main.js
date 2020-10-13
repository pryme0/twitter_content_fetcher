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
                        var main = document.getElementById('main')
                        main.innerHTML = ''
                        userData.forEach((dat) => {
                            let link = dat.text.split('https')
                            let well = document.createElement('div')
                            let media_body = document.createElement('div')
                            let mainCont = document.createElement('div')
                            let container = document.createElement('div')
                            let media = document.createElement('div')
                            let pull_left = document.createElement('a')
                            let textLink = document.createElement('a')
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
                            textLink.href = `https${link[1]}`
                            textLink.innerHTML = 'Readmore..'
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
                            p2.appendChild(textLink)
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
            if(stringPref === '') return 
            var data = JSON.stringify(preffArray);
            fetch('/updateinterest', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: data
                }).then((resp) => resp.json())
                .then(data => {
                    console.log(data)
                    let alertHolder = document.getElementById('alertHolder')
                    console.log(alertHolder)
                    let messHolder = document.getElementById('alertMessage')
                    messHolder.innerHTML = data
                    alertHolder.style.display = 'block'
                })
        }

     

        //getInterest method
        let getInterests = function() {
            fetch('/getInterest')
                .then((res) => res.json())
                .then(dat => {
                    let interestTag = document.getElementById('interests')
                    interestTag.style.margin = 'auto'
                    let modalBody = document.getElementById('modalBody')
                    interestTag.style.padding = '90px'
                    interestTag.style.color = 'white'
                    let ul = document.createElement('ul')
                    ul.className = 'list-unstyled'
                    dat.forEach(data => {
                        let i = document.createElement('i')
                        let span = document.createElement('span')
                        let li = document.createElement('li')
                        span.className = 'fa fa-times'
                        span.style.backgroundColor = 'red'
                        span.style.padding = '8px'
                        span.addEventListener('click', deleteInterest)
                        span.style.margin = '5px'
                        span.id = data

                        li.style.padding = '10px'
                        li.style.height = '65px'
                        li.style.width = '250px'
                        li.style.margin = '3px'
                        li.style.backgroundColor = 'black'
                        li.style.color = 'white'
                        li.style.borderRadius = '12px'
                        li.style.border ='1px solid grey'

                       
                        li.style.textAlign = 'center'
                        li.style.border = '5px solid grey'
                        li.innerHTML = data
                        li.appendChild(span)
                        ul.appendChild(li)
                        modalBody.appendChild(ul)
                    })
                    interestTag.appendChild(modalBody)
                })
        }
        //method to delete user interets
        let deleteInterest = function(e) {
            e.preventDefault()
            console.log(this.id)
             let interest = this.id
            window.fetch(`/deleteInterest/${interest}`)
            .then((res)=>res.json())
            .then((dat)=>{
                let interestTag = document.getElementById('interests')
                interestTag.innerHTML  = "<div class='spinner-border' style='width: 3rem; height: 3rem;' role='status'><span class='sr-only'>Loading...</span> </div>"
                interestTag.style.margin = 'auto'
                interestTag.style.padding = '20px'
                interestTag.style.color = 'white'
                let ul = document.createElement('ul')
                ul.className = 'list-unstyled'
                dat.forEach(data => {
                    let i = document.createElement('i')
                    let span = document.createElement('span')
                    let li = document.createElement('li')
                    li.style.marginBottom = '5px'
                    span.className = 'fa fa-times'
                    span.style.backgroundColor = 'red'
                    span.style.padding = '10px'
                    span.addEventListener('click', deleteInterest)
                    span.style.margin = '5px'
                    span.id = data


                    li.style.padding = '10px'
                    li.style.height = '65px'
                    li.style.width = '250px'
                    li.style.margin = '3px'
                    li.style.backgroundColor = 'black'
                    li.style.color = 'white'
                    li.style.borderRadius = '12px'
                    li.style.border ='1px solid grey'
                    li.style.borderColor ='white'
                    li.style.margin = '2px'
                    li.style.textAlign = 'center'
                    li.innerHTML = data
                    li.appendChild(span)
                    ul.appendChild(li)
                })
                interestTag.innerHTML = ''
                interestTag.appendChild(ul)

                //alert user
                let alertHolder = document.getElementById('deleteAlert')
                let messHolder = document.getElementById('deleteMessage')
                messHolder.innerHTML = 'Interest removed'
                alertHolder.style.display = 'block'
            }).catch(function (err) {
                console.log(err)
                // let alertHolder = document.getElementById('deleteAlert')
                // let messHolder = document.getElementById('deleteMessage')
                // console.log(messHolder)
                // messHolder.innerHTML = 'operation failed try again'
                // alertHolder.style.display = 'block'                
            })
        }

        getContent()
        getInterests()
        let clickPreffUpdate = document.getElementById('submitInterest').addEventListener('click', upPref)
    }

}