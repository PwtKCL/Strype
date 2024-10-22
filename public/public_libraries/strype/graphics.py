import strype_graphics_internal as _strype_graphics_internal
import strype_graphics_input_internal as _strype_input_internal
import math as _math
import collections as _collections

class Actor:
    def __init__(self, image_filename, x, y):
        self.__id = _strype_graphics_internal.addImage(_strype_graphics_internal.loadAndWaitForImage(image_filename), self)
        _strype_graphics_internal.setImageLocation(self.__id, x, y)
        _strype_graphics_internal.setImageRotation(self.__id, 0)
    def set_location(self, x, y):
        _strype_graphics_internal.setImageLocation(self.__id, x, y)
    def set_rotation(self, deg):
        _strype_graphics_internal.setImageRotation(self.__id, deg)
    def set_scale(self, scale):
        _strype_graphics_internal.setImageScale(self.__id, scale)
    def remove(self):
        _strype_graphics_internal.removeImage(self.__id)
    def get_x(self):
         # Gets X with rounding (towards zero):
        return int(_strype_graphics_internal.getImageLocation(self.__id)['x'])
    def get_y(self):
        # Gets Y with rounding (towards zero):
        return int(_strype_graphics_internal.getImageLocation(self.__id)['y'])
    def get_exact_x(self):
        # Gets X with no rounding:
        return _strype_graphics_internal.getImageLocation(self.__id)['x']
    def get_exact_y(self):
        # Gets Y with no rounding:
        return _strype_graphics_internal.getImageLocation(self.__id)['y']
    def move(self, amount):
        cur = _strype_graphics_internal.getImageLocation(self.__id)
        rot = _math.radians(_strype_graphics_internal.getImageRotation(self.__id))
        self.set_location(cur['x'] + amount * _math.cos(rot), cur['y'] + amount * _math.sin(rot))
    def turn(self, degrees):
        self.set_rotation(_strype_graphics_internal.getImageRotation(self.__id) + degrees)
    def is_touching(self, actor):
        """
        Checks if this actor is touching the given actor.  Two actors are deemed to be touching if the
        rectangles of their images are overlapping (even if the actor is transparent at that point). 
        :param actor: The actor to check for overlap
        :return: True if this actor overlaps that actor, False if it does not 
        """
        return _strype_input_internal.checkCollision(self.__id, actor.__id)

def get_and_forget_clicked_actor():
    """
    Gets the last clicked Actor (or None if nothing was clicked since the last call to this function).  Be careful that if you call this twice
    in quick succession, the second call will almost certainly be None.  If you need to compare the result of this function
    to several other things, assign it to a variable first.
    :return: The most recently clicked Actor, or None if nothing was clicked since you last called this function.
    """
    return _strype_input_internal.getAndResetClickedItem()

def key_pressed(keyname):
    """
    Checks if the given key is currently pressed.  Note that because the user may be pressing and releasing keys all the time,
    consecutive calls to this function with the same key name may not give the same result.
    
    :param keyname: The name of the key.  This can be a single letter like "a" or a key name like "up", "down". 
    :return: Either True or False depending on whether the key is currently pressed.
    """
    return _collections.defaultdict(lambda: False, _strype_input_internal.getPressedKeys())[keyname]
