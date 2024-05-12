/*
   This extension was made with TurboBuilder!
   https://turbobuilder-steel.vercel.app/
*/
(async function(Scratch) {
    const variables = {};
    const blocks = [];
    const menus = {};


    if (!Scratch.extensions.unsandboxed) {
        alert("This extension needs to be unsandboxed to run!")
        return
    }

    function doSound(ab, cd, runtime) {
        const audioEngine = runtime.audioEngine;

        const fetchAsArrayBufferWithTimeout = (url) =>
            new Promise((resolve, reject) => {
                const xhr = new XMLHttpRequest();
                let timeout = setTimeout(() => {
                    xhr.abort();
                    reject(new Error("Timed out"));
                }, 5000);
                xhr.onload = () => {
                    clearTimeout(timeout);
                    if (xhr.status === 200) {
                        resolve(xhr.response);
                    } else {
                        reject(new Error(`HTTP error ${xhr.status} while fetching ${url}`));
                    }
                };
                xhr.onerror = () => {
                    clearTimeout(timeout);
                    reject(new Error(`Failed to request ${url}`));
                };
                xhr.responseType = "arraybuffer";
                xhr.open("GET", url);
                xhr.send();
            });

        const soundPlayerCache = new Map();

        const decodeSoundPlayer = async (url) => {
            const cached = soundPlayerCache.get(url);
            if (cached) {
                if (cached.sound) {
                    return cached.sound;
                }
                throw cached.error;
            }

            try {
                const arrayBuffer = await fetchAsArrayBufferWithTimeout(url);
                const soundPlayer = await audioEngine.decodeSoundPlayer({
                    data: {
                        buffer: arrayBuffer,
                    },
                });
                soundPlayerCache.set(url, {
                    sound: soundPlayer,
                    error: null,
                });
                return soundPlayer;
            } catch (e) {
                soundPlayerCache.set(url, {
                    sound: null,
                    error: e,
                });
                throw e;
            }
        };

        const playWithAudioEngine = async (url, target) => {
            const soundBank = target.sprite.soundBank;

            let soundPlayer;
            try {
                const originalSoundPlayer = await decodeSoundPlayer(url);
                soundPlayer = originalSoundPlayer.take();
            } catch (e) {
                console.warn(
                    "Could not fetch audio; falling back to primitive approach",
                    e
                );
                return false;
            }

            soundBank.addSoundPlayer(soundPlayer);
            await soundBank.playSound(target, soundPlayer.id);

            delete soundBank.soundPlayers[soundPlayer.id];
            soundBank.playerTargets.delete(soundPlayer.id);
            soundBank.soundEffects.delete(soundPlayer.id);

            return true;
        };

        const playWithAudioElement = (url, target) =>
            new Promise((resolve, reject) => {
                const mediaElement = new Audio(url);

                mediaElement.volume = target.volume / 100;

                mediaElement.onended = () => {
                    resolve();
                };
                mediaElement
                    .play()
                    .then(() => {
                        // Wait for onended
                    })
                    .catch((err) => {
                        reject(err);
                    });
            });

        const playSound = async (url, target) => {
            try {
                if (!(await Scratch.canFetch(url))) {
                    throw new Error(`Permission to fetch ${url} denied`);
                }

                const success = await playWithAudioEngine(url, target);
                if (!success) {
                    return await playWithAudioElement(url, target);
                }
            } catch (e) {
                console.warn(`All attempts to play ${url} failed`, e);
            }
        };

        playSound(ab, cd)
    }
    class Extension {
        getInfo() {
            return {
                "id": "since1970",
                "name": "Since 1970",
                "color1": "#1100ff",
                "color2": "#ff0000",
                "blocks": blocks,
                "menus": menus
            }
        }
    }
    blocks.push({
        opcode: "mssince1970",
        blockType: Scratch.BlockType.REPORTER,
        text: "milliseconds since 1970",
        arguments: {},
        disableMonitor: true,
        isEdgeActivated: false
    });
    Extension.prototype["mssince1970"] = async (args, util) => {
        return Date.now()
    };

    blocks.push({
        opcode: "secondssince1970",
        blockType: Scratch.BlockType.REPORTER,
        text: "seconds since 1970",
        arguments: {},
        disableMonitor: true,
        isEdgeActivated: false
    });
    Extension.prototype["secondssince1970"] = async (args, util) => {
        return (Date.now() * 1 / 1000)
    };

    blocks.push({
        opcode: "minutessince1970",
        blockType: Scratch.BlockType.REPORTER,
        text: "minutes since 1970",
        arguments: {},
        disableMonitor: true,
        isEdgeActivated: false
    });
    Extension.prototype["minutessince1970"] = async (args, util) => {
        return (Date.now() * 1 / 60000)
    };

    blocks.push({
        opcode: "hourssince1970",
        blockType: Scratch.BlockType.REPORTER,
        text: "hours since 1970",
        arguments: {},
        disableMonitor: true,
        isEdgeActivated: false
    });
    Extension.prototype["hourssince1970"] = async (args, util) => {
        return (Date.now() * 1 / 3600000)
    };

    blocks.push({
        opcode: "dayssince1970",
        blockType: Scratch.BlockType.REPORTER,
        text: "days since 1970",
        arguments: {},
        disableMonitor: true,
        isEdgeActivated: false
    });
    Extension.prototype["dayssince1970"] = async (args, util) => {
        return (Date.now() * 1 / 86400000)
    };

    blocks.push({
        opcode: "yearssince1970",
        blockType: Scratch.BlockType.REPORTER,
        text: "years since 1970",
        arguments: {},
        disableMonitor: true,
        isEdgeActivated: false
    });
    Extension.prototype["yearssince1970"] = async (args, util) => {
        return ((Date.now() * 1 / 86400000) / 365)
    };

    blocks.push({
        opcode: "decadessince1970",
        blockType: Scratch.BlockType.REPORTER,
        text: "decades since 1970",
        arguments: {},
        disableMonitor: true,
        isEdgeActivated: false
    });
    Extension.prototype["decadessince1970"] = async (args, util) => {
        return (((Date.now() * 1 / 86400000) / 365) / 10)
    };

    blocks.push({
        opcode: "centuriessince1970",
        blockType: Scratch.BlockType.REPORTER,
        text: "centuries since 1970",
        arguments: {},
        disableMonitor: true,
        isEdgeActivated: false
    });
    Extension.prototype["centuriessince1970"] = async (args, util) => {
        return ((((Date.now() * 1 / 86400000) / 365) / 10) / 10)
    };

    Scratch.extensions.register(new Extension());
})(Scratch);