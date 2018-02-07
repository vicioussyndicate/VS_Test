


import matplotlib.pyplot as plt
import numpy as np


x = np.arange(0,3,0.01)
d1 = [(i+1)**0.5 for i in x]
d2 = [(i+1)/2 for i in x]


plt.plot(x,d1)
plt.plot(x,d2)
plt.show()