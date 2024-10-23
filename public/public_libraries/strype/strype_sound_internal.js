// This file contains the internal sound/music API for Strype.
// These functions are not directly exposed to users, but are used by sound.py to
// form the actual public API.

// eslint-disable-next-line @typescript-eslint/no-unused-vars
var $builtinmodule = function(name)  {
    var mod = {};
    mod.playOneOffSound = new Sk.builtin.func(function(soundFileName) {
        peaComponent.__vue__.playOneOffSound(soundFileName);
    });
    mod.playAudioBuffer = new Sk.builtin.func(function(audioBuffer) {
        peaComponent.__vue__.playAudioBuffer(audioBuffer);
    });
    mod.createAudioBuffer = new Sk.builtin.func(function(seconds, samplesPerSecond) {
        return new AudioBuffer({length: seconds * samplesPerSecond, sampleRate: samplesPerSecond});
    });
    mod.loadAndWaitForAudioBuffer = new Sk.builtin.func(function(path) {
        const audioContext = peaComponent.__vue__.getAudioContext();
        let susp = new Sk.misceval.Suspension();
        susp.resume = function () {
            if (susp.data["error"]) {
                throw new Sk.builtin.IOError(susp.data["error"].message);
            }
            return susp.ret;
        };
        susp.data = {
            type: "Sk.promise",
            promise: fetch("./sounds/" + path)
                .then((d) => d.arrayBuffer())
                .then((b) => audioContext.decodeAudioData(b))
                .then((b) => {
                    if (!b) {
                        susp.data["error"] = Error("Cannot load audio file \"" + path + "\"");
                    }
                    else  {
                        susp.ret = b;
                    }
                }),
        };
        return susp;
    }); 
    mod.getSamples = new Sk.builtin.func(function(buffer) {
        if (buffer.numberOfChannels > 1) {
            throw new Error("Cannot get samples from stereo sound; convert to mono first");
        }
        else {
            // Simple case of mono sound: just return the data
            return Sk.ffi.remapToPy(buffer.getChannelData(0));
        }
    });
    mod.setSamples = new Sk.builtin.func(function(buffer, floatArray, offset) {
        if (buffer.numberOfChannels > 1) {
            throw new Error("Cannot set samples in stereo sound; convert to mono first");
        }
        else {
            // Simple case of mono sound: 
            const floats = new Float32Array(Sk.ffi.remapToJs(floatArray));
            buffer.copyToChannel(floats, 0, offset);
        }
    });
    mod.getNumSamples = new Sk.builtin.func(function(buffer) {
        return Sk.ffi.remapToPy(buffer.length);
    });

    return mod;
};
