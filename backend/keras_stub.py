"""
Keras stub module to allow loading models saved with Keras dependencies
This is a minimal stub that provides the necessary classes for pickle loading
"""
import sys
from types import ModuleType

# Create a minimal keras module
keras = ModuleType('keras')
keras.models = ModuleType('keras.models')
keras.layers = ModuleType('keras.layers')
keras.engine = ModuleType('keras.engine')
keras.engine.base_layer = ModuleType('keras.engine.base_layer')
keras.engine.training = ModuleType('keras.engine.training')
keras.engine.functional = ModuleType('keras.engine.functional')
keras.engine.input_layer = ModuleType('keras.engine.input_layer')
keras.engine.sequential = ModuleType('keras.engine.sequential')

# Create minimal base classes that pickle might need
class Layer:
    """Minimal Layer stub"""
    pass

class Model:
    """Minimal Model stub"""
    pass

class Functional:
    """Minimal Functional stub"""
    pass

class Sequential:
    """Minimal Sequential stub"""
    pass

# Attach to modules
keras.layers.Layer = Layer
keras.models.Model = Model
keras.engine.base_layer.Layer = Layer
keras.engine.training.Model = Model
keras.engine.functional.Functional = Functional
keras.engine.input_layer.InputLayer = Layer
keras.engine.sequential.Sequential = Sequential

# Add to sys.modules so pickle can find it
sys.modules['keras'] = keras
sys.modules['keras.models'] = keras.models
sys.modules['keras.layers'] = keras.layers
sys.modules['keras.engine'] = keras.engine
sys.modules['keras.engine.base_layer'] = keras.engine.base_layer
sys.modules['keras.engine.training'] = keras.engine.training
sys.modules['keras.engine.functional'] = keras.engine.functional
sys.modules['keras.engine.input_layer'] = keras.engine.input_layer
sys.modules['keras.engine.sequential'] = keras.engine.sequential

