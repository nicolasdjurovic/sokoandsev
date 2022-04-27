// Page loader

$(window).on("load",function(){
    $(".loader-wrapper").fadeOut("slow");
});

// Form validation

$(function(){
    $('#form').validate({
        
    });
});

// Gallery



// Music player 

new zAudio({
    divId: 'player',
    autoplay: false,
    miniplayer: false,
    color: '#f5cb5c',
    deafultVolume: 50,
    shuffle: false,
    download: false
}, [
{
    title: 'Bodies (Original Mix)',
    artist: 'Soko & Sev',
    albumArturl: ('http://sokoandsev.com/cover/kraftek.jpg'),
    url: 'http://sokoandsev.com/music/bodies-kraftek.mp3'
},
{
    title: 'She Is The Devil (Original Mix)',
    artist: 'Soko & Sev',
    albumArturl: ('http://sokoandsev.com/cover/iamt.jpg'),
    url: 'http://sokoandsev.com/music/sheIsTheDevil-iamt.mp3'
},
{
    title: 'Endless Night (Original Mix)',
    artist: 'Soko & Sev',
    albumArturl: ('http://sokoandsev.com/cover/iamt.jpg'),
    url: 'http://sokoandsev.com/music/endlessNight-iamt.mp3'
},
{
    title: 'Dark Soul (Original Mix)',
    artist: 'Soko & Sev',
    albumArturl: ('http://sokoandsev.com/cover/setAbout.jpg'),
    url: 'http://sokoandsev.com/music/darkSoul-setAbout.mp3'
},
{
    title: 'Open Veins (Original Mix)',
    artist: 'Soko & Sev',
    albumArturl: ('http://sokoandsev.com/cover/setAbout.jpg'),
    url: 'http://sokoandsev.com/music/openVeins-setAbout.mp3'
},
{
    title: 'Titan (Original Mix)',
    artist: 'Soko & Sev',
    albumArturl: ('http://sokoandsev.com/cover/setAbout.jpg'),
    url: 'http://sokoandsev.com/music/titan-setAbout.mp3'
},
{
    title: 'War (Original Mix)',
    artist: 'Soko & Sev',
    albumArturl: ('http://sokoandsev.com/cover/setAbout.jpg'),
    url: 'http://sokoandsev.com/music/war-setAbout.mp3'
},
{
    title: 'Tension (Original Mix)',
    artist: 'Soko & Sev',
    albumArturl: ('http://sokoandsev.com/cover/reload.jpg'),
    url: 'http://sokoandsev.com/music/tension-reload.mp3'
},
{
    title: 'Helium (Original Mix)',
    artist: 'Soko & Sev',
    albumArturl: ('http://sokoandsev.com/cover/reload.jpg'),
    url: 'http://sokoandsev.com/music/helium-reload.mp3'
},
{
    title: 'Xenon (Original Mix)',
    artist: 'Soko & Sev',
    albumArturl: ('http://sokoandsev.com/cover/reload.jpg'),
    url: 'http://sokoandsev.com/music/Xenon-reload.mp3'
},
{
    title: 'Know No Darkness (Original Mix)',
    artist: 'Soko & Sev',
    albumArturl: ('http://sokoandsev.com/cover/autektone.jpg'),
    url: 'http://sokoandsev.com/music/knowNoDarkness-autektone.mp3'
},
{
    title: 'Inside Your Mind (Original Mix)',
    artist: 'Soko & Sev',
    albumArturl: ('http://sokoandsev.com/cover/autektone.jpg'),
    url: 'http://sokoandsev.com/music/insideYourMind-autektone.mp3'
},
{
    title: 'Your Life (Original Mix)',
    artist: 'Soko & Sev',
    albumArturl: ('http://sokoandsev.com/cover/autektone.jpg'),
    url: 'http://sokoandsev.com/music/yourLife-autektone.mp3'
},
{
    title: 'Bassiani (Original Mix)',
    artist: 'Soko & Sev',
    albumArturl: ('http://sokoandsev.com/cover/playOff.jpg'),
    url: 'http://sokoandsev.com/music/bassiani-playOff.mp3'
},
{
    title: 'Warrior (Original Mix)',
    artist: 'Soko & Sev',
    albumArturl: ('http://sokoandsev.com/cover/playOff.jpg'),
    url: 'http://sokoandsev.com/music/warrior-playOff.mp3'
},
{
    title: 'No Horizon (Original Mix)',
    artist: 'Soko & Sev',
    albumArturl: ('http://sokoandsev.com/cover/playOff.jpg'),
    url: 'http://sokoandsev.com/music/noHorizon-playOff.mp3'
},
{
    title: 'Hammer (Original Mix)',
    artist: 'Soko & Sev',
    albumArturl: ('http://sokoandsev.com/cover/reloadBlack.jpg'),
    url: 'http://sokoandsev.com/music/hammer-reloadBlack.mp3'
},
{
    title: 'The Beginning (Original Mix)',
    artist: 'Soko & Sev',
    albumArturl: ('http://sokoandsev.com/cover/reloadBlack.jpg'),
    url: 'http://sokoandsev.com/music/theBeginning-reloadBlack.mp3'
},
{
    title: 'Salvation (Original Mix)',
    artist: 'Soko & Sev',
    albumArturl: ('http://sokoandsev.com/cover/reloadBlack.jpg'),
    url: 'http://sokoandsev.com/music/salvation-reloadBlack.mp3'
},
{
    title: 'Internal Shift (Original Mix)',
    artist: 'Soko & Sev',
    albumArturl: ('http://sokoandsev.com/cover/sayWhat.jpg'),
    url: 'http://sokoandsev.com/music/internalShift-sayWhat.mp3'
},
]);